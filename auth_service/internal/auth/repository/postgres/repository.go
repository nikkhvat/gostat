package postgres

import (
	"errors"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return UserRepository{db: db}
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

	return &model.UserClaims{
		Id:    userID,
		Login: userLogin,
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
	if err := r.db.Where("(login = ? OR email = ?) AND password = ?", identifier, identifier, password).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r UserRepository) RegistrationUser(login, mail, password, firstName, lastName, middleName string) (model.User, error) {

	user := model.User{
		Email:            mail,
		Login:            login,
		Password:         password,
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
