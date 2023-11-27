package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
	"github.com/nik19ta/gostat/auth_service/pkg/argon2"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type UserRepository struct {
	db  *gorm.DB
	rdb *redis.Client
}

func NewUserRepository(db *gorm.DB, rdb *redis.Client) UserRepository {
	return UserRepository{db: db, rdb: rdb}
}

type SessionData struct {
	UserId    uint64
	Allow     bool
	CreatedAt time.Time
	UUID      string
}

func (r *UserRepository) GetUserSessions(userId uint64) ([]SessionData, error) {
	ctx := context.Background()

	allKeys, err := r.rdb.Keys(ctx, "*").Result()
	if err != nil {
		return nil, err
	}

	var sessions []SessionData
	for _, key := range allKeys {
		val, err := r.rdb.Get(ctx, key).Result()
		if err != nil {
			continue
		}

		var session SessionData
		err = json.Unmarshal([]byte(val), &session)
		if err != nil {
			continue
		}

		if session.UserId == userId {
			session.UUID = key
			sessions = append(sessions, session)
		}
	}

	return sessions, nil
}

func (r *UserRepository) RegisterNewSession(uuid string, userId uint64) error {
	ctx := context.Background()
	session := SessionData{
		UserId:    userId,
		Allow:     true,
		CreatedAt: time.Now(),
	}

	sessionData, err := json.Marshal(session)
	if err != nil {
		return err
	}

	expiration := 30 * 24 * time.Hour
	return r.rdb.Set(ctx, uuid, sessionData, expiration).Err()
}

func (r *UserRepository) RevokeToken(uuid string) error {
	ctx := context.Background()
	val, err := r.rdb.Get(ctx, uuid).Result()
	if err != nil {
		return err
	}

	var session SessionData
	err = json.Unmarshal([]byte(val), &session)
	if err != nil {
		return err
	}

	session.Allow = false
	sessionData, err := json.Marshal(session)
	if err != nil {
		return err
	}

	expiration := 30 * 24 * time.Hour
	return r.rdb.Set(ctx, uuid, sessionData, expiration).Err()
}

func (r *UserRepository) CheckSession(uuid string) (bool, error) {
	ctx := context.Background()

	val, err := r.rdb.Get(ctx, uuid).Result()
	if err != nil {
		if err == redis.Nil {
			return false, nil
		}
		return false, err
	}

	var session SessionData
	err = json.Unmarshal([]byte(val), &session)
	if err != nil {
		return false, err
	}

	return session.Allow, nil
}

func (r UserRepository) AccountConfirm(secret string) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var user model.User
	if err := tx.Where("code = ?", secret).First(&user).Error; err != nil {
		tx.Rollback()
		return err
	}

	user.AccountConfirmed = true
	if err := tx.Save(&user).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func (r UserRepository) RefreshToken(token string) (*model.UserClaims, error) {
	claims, err := decodeRefreshToken(token)
	if err != nil {
		return nil, err
	}

	userID, ok := claims["user_id"].(float64)
	if !ok {
		return nil, errors.New("invalid user_id in the token")
	}

	userLogin, ok := claims["user_login"].(string)
	if !ok {
		return nil, errors.New("invalid user_login in the token")
	}

	sessionUUID, ok := claims["session_uuid"].(string)
	if !ok {
		return nil, errors.New("invalid user_login in the token")
	}

	return &model.UserClaims{
		Id:          userID,
		Login:       userLogin,
		SessionUUID: sessionUUID,
	}, nil
}

func decodeRefreshToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func (r UserRepository) GetUserByLoginAndPassword(identifier, password string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("login = ? OR email = ?", identifier, identifier).First(&user).Error; err != nil {
		return nil, err
	}

	match := argon2.ComparePasswordAndHash(password, user.Password)

	if !match {
		return nil, errors.New("invalid password")
	}

	return &user, nil
}

func (r UserRepository) RegistrationUser(login, mail, password, firstName, lastName, middleName string) (model.User, error) {

	hashedPassword := argon2.GeneratePasswordHash(password)

	user := model.User{
		Email:            mail,
		Login:            login,
		Password:         hashedPassword,
		FirstName:        firstName,
		LastName:         lastName,
		MiddleName:       middleName,
		Code:             uuid.New().String(),
		AccountConfirmed: false,
	}

	if err := r.db.Create(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}

func (r UserRepository) UpdateConfirmationCode(userID uint64) (*string, error) {
	newCode := uuid.New().String()

	user := model.User{}
	if err := r.db.Model(&user).Where("id = ?", userID).Updates(map[string]interface{}{"Code": newCode}).Error; err != nil {
		return nil, err
	}

	return &newCode, nil
}

func (r UserRepository) PasswordRequest(mail string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("email = ?", mail).First(&user).Error; err != nil {
		return nil, err
	}

	user.PasswordRecoveryCode = uuid.New().String()

	if err := r.db.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r UserRepository) PasswordReset(password, secret string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("password_recovery_code = ?", secret).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no user found with the provided email and secret code")
		}
		return nil, err
	}

	hashedPassword := argon2.GeneratePasswordHash(password)

	user.Password = hashedPassword
	user.PasswordRecoveryCode = ""

	if err := r.db.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r UserRepository) GetUserById(id uint64) (*model.User, error) {
	var user model.User
	result := r.db.First(&user, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, result.Error
	}

	return &user, nil
}
