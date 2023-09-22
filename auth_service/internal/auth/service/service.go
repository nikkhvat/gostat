package service

import (
	"strings"

	"time"

	"github.com/golang-jwt/jwt"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
	"github.com/nik19ta/gostat/auth_service/pkg/env"
)

type AuthService struct {
	repo postgres.UserRepository
}

func NewAuthService(r postgres.UserRepository) AuthService {
	return AuthService{repo: r}
}

func (s AuthService) RefreshToken(token string) (string, error) {
	user, err := s.repo.RefreshToken(token)

	if err != nil {
		return "", err
	}

	tokens, err := generateToken(uint(user.Id), user.Login)

	if err != nil {
		return "", err
	}

	return tokens.JWTToken, err
}

func (s AuthService) Authenticate(login, password string) (*TokenResponse, error) {
	user, err := s.repo.GetUserByLoginAndPassword(login, password)
	if err != nil {
		return nil, err
	}

	token, err := generateToken(user.ID, user.Login)
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

func generateToken(userID uint, login string) (*TokenResponse, error) {
	accessToken := jwt.New(jwt.SigningMethodHS256)
	claims := accessToken.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["user_login"] = login
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix()

	t, err := accessToken.SignedString([]byte(env.Get("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["user_id"] = userID
	rtClaims["user_login"] = login
	rtClaims["type"] = "refresh"
	rtClaims["exp"] = time.Now().Add(time.Hour * (24 * 7)).Unix()

	rt, err := refreshToken.SignedString([]byte(env.Get("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		JWTToken:     t,
		RefreshToken: rt,
	}, nil
}
