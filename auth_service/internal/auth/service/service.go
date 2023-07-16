package service

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
)

type AuthService struct {
	repo postgres.UserRepository
}

func NewAuthService(r postgres.UserRepository) AuthService {
	return AuthService{repo: r}
}

func (s AuthService) Login(login, password string) (string, error) {
	user, err := s.repo.GetUserByLoginAndPassword(login, password)
	if err != nil {
		return "", err
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["user_login"] = user.Login

	t, err := token.SignedString([]byte("your_secret_key"))
	if err != nil {
		return "", err
	}

	return t, nil
}
