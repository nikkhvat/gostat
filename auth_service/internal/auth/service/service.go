package service

import (
	"errors"
	"regexp"
	"strings"

	"time"

	"github.com/golang-jwt/jwt"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
	"github.com/nik19ta/gostat/auth_service/pkg/env"

	"github.com/google/uuid"
)

type AuthService struct {
	repo postgres.UserRepository
}

func GenerateUUID() string {
	return uuid.New().String()
}

func NewAuthService(r postgres.UserRepository) AuthService {
	return AuthService{repo: r}
}

func (s AuthService) RefreshToken(token string) (*string, error) {
	user, err := s.repo.RefreshToken(token)

	if err != nil {
		return nil, err
	}

	isAllow, err := s.repo.CheckSession(user.SessionUUID)

	if isAllow == false {
		return nil, errors.New("session has been revoked")
	}

	tokens, err := generateToken(uint(user.Id), user.Login, user.SessionUUID)

	if err != nil {
		return nil, err
	}

	return &tokens.JWTToken, err
}

func (s AuthService) ConfirmAccount(secret string) error {
	return s.repo.AccountConfirm(secret)
}

func (s AuthService) Authenticate(login, password string) (*TokenResponse, error) {
	user, err := s.repo.GetUserByLoginAndPassword(login, password)
	if err != nil {
		return nil, err
	}

	newUUID := GenerateUUID()
	token, err := generateToken(user.ID, user.Login, newUUID)
	s.repo.RegisterNewSession(newUUID, uint(user.ID))
	if err != nil {
		return nil, err
	}

	return token, nil
}

type RegResponse struct {
	Token        string
	RefreshToken string
	ConfirmCode  string
	Status       bool
	Text         string
}

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

func hasUpperCase(s string) bool {
	for _, r := range s {
		if 'A' <= r && r <= 'Z' {
			return true
		}
	}
	return false
}

func hasSpecialCharacter(s string) bool {
	re := regexp.MustCompile(`[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]`)
	return re.MatchString(s)
}

func (s AuthService) Registration(login, mail, password, firstName, lastName, middleName string) (*RegResponse, error) {
	user, err := s.repo.RegistrationUser(login, mail, password, firstName, lastName, middleName)

	if login == "" || mail == "" || password == "" || firstName == "" || lastName == "" || middleName == "" {
		return &RegResponse{
			Status: false,
			Text:   "all fields are required",
		}, nil
	}

	if !isValidEmail(mail) {
		return &RegResponse{
			Status: false,
			Text:   "invalid email format",
		}, nil
	}

	if len(password) < 8 || !hasUpperCase(password) || !hasSpecialCharacter(password) {
		return &RegResponse{
			Status: false,
			Text:   "password must be at least 8 characters, include an uppercase letter and a special character",
		}, nil
	}

	if err != nil {
		if strings.Contains(err.Error(), "uix_users_email") {
			return &RegResponse{
				Status: false,
				Text:   "duplicate key value violates unique constraint uix_users_email",
			}, nil
		} else if strings.Contains(err.Error(), "uix_users_login") {
			return &RegResponse{
				Status: false,
				Text:   "duplicate key value violates unique constraint uix_users_login",
			}, nil
		} else {
			return &RegResponse{
				Status: false,
				Text:   err.Error(),
			}, nil
		}
	}

	newUUID := GenerateUUID()
	token, tokenErr := generateToken(user.ID, user.Login, newUUID)
	s.repo.RegisterNewSession(newUUID, uint(user.ID))

	if tokenErr != nil {
		return &RegResponse{
			Status: false,
			Text:   "create token error",
		}, nil
	}

	return &RegResponse{
		Token:        token.JWTToken,
		RefreshToken: token.RefreshToken,
		ConfirmCode:  user.Code,
		Status:       true,
	}, nil
}

type TokenResponse struct {
	JWTToken     string `json:"jwt_token"`
	RefreshToken string `json:"refresh_token"`
}

func generateToken(userID uint, login string, sessionUUID string) (*TokenResponse, error) {
	accessToken := jwt.New(jwt.SigningMethodHS256)
	claims := accessToken.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["user_login"] = login
	claims["session_uuid"] = sessionUUID
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix()

	t, err := accessToken.SignedString([]byte(env.Get("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["user_id"] = userID
	rtClaims["user_login"] = login
	rtClaims["session_uuid"] = sessionUUID
	rtClaims["type"] = "refresh"
	rtClaims["exp"] = time.Now().Add(time.Hour * (24 * 30)).Unix()

	rt, err := refreshToken.SignedString([]byte(env.Get("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		JWTToken:     t,
		RefreshToken: rt,
	}, nil
}

func (s AuthService) PasswordRequest(mail string) (*model.User, error) {
	user, err := s.repo.PasswordRequest(mail)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s AuthService) PasswordReset(secret, mail, password string) (*TokenResponse, error) {
	user, err := s.repo.PasswordReset(mail, password, secret)

	if err != nil {
		return nil, err
	}

	newUUID := GenerateUUID()
	tokens, err := generateToken(uint(user.ID), user.Login, newUUID)
	s.repo.RegisterNewSession(newUUID, uint(user.ID))

	if err != nil {
		return nil, err
	}

	return tokens, err
}

func (s AuthService) GetUserInfo(id uint64) (*model.User, error) {
	return s.repo.GetUserById(id)
}

func (s AuthService) SetNewConfirmCode(id uint64) (*string, error) {
	return s.repo.UpdateConfirmationCode(id)
}

func (s AuthService) RevokeToken(uuid string) error {
	return s.repo.RevokeToken(uuid)
}
