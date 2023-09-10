package service

import (
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
	"github.com/nik19ta/gostat/auth_service/pkg/env"
)

type AuthService struct {
	repo postgres.UserRepository
}

func NewAuthService(r postgres.UserRepository) AuthService {
	return AuthService{repo: r}
}

func (s AuthService) Authenticate(login, password string) (string, error) {
	user, err := s.repo.GetUserByLoginAndPassword(login, password)
	if err != nil {
		return "", err
	}

	token, err := generateToken(user.ID, user.Login)
	if err != nil {
		return "", err
	}

	return token, nil
}

type RegResponse struct {
	Token       string
	ConfirmCode string
	Status      bool
	Text        string
}

func (s AuthService) Registration(login, mail, password, firstName, lastName, middleName string) (*RegResponse, error) {
	user, err := s.repo.RegistrationUser(login, mail, password, firstName, lastName, middleName)

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
				Text:   "any error",
			}, nil
		}
	}

	token, tokenErr := generateToken(user.ID, user.Login)

	if tokenErr != nil {
		return &RegResponse{
			Status: false,
			Text:   "create token error",
		}, nil
	}

	return &RegResponse{Token: token, ConfirmCode: user.Code, Status: true}, nil
}

func generateToken(userID uint, login string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["user_login"] = login

	t, err := token.SignedString([]byte(env.Get("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return t, nil
}
