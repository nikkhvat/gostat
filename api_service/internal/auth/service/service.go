package service

import (
	"context"

	"github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	"github.com/nik19ta/gostat/api_service/proto/auth"
)

type AuthService struct {
	client *grpc.AuthClient
}

func NewAuthService(client *grpc.AuthClient) *AuthService {
	return &AuthService{client: client}
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type RegistrationRequest struct {
	Login      string `json:"login"`
	Mail       string `json:"mail"`
	Password   string `json:"password"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	MiddleName string `json:"middle_name"`
}

func (s *AuthService) Login(ctx context.Context, req LoginRequest) (string, error) {
	resp, err := s.client.Login(ctx, &auth.LoginRequest{
		Login:    req.Login,
		Password: req.Password,
	})
	if err != nil {
		return "", err
	}
	return resp.GetToken(), nil
}

func (s *AuthService) Registration(ctx context.Context, req RegistrationRequest) (string, error) {
	resp, err := s.client.Registration(ctx, &auth.RegistrationRequest{
		Login:      req.Login,
		Mail:       req.Mail,
		Password:   req.Password,
		FirstName:  req.FirstName,
		LastName:   req.LastName,
		MiddleName: req.MiddleName,
	})

	if err != nil {
		return "", err
	}
	return resp.GetToken(), nil
}
