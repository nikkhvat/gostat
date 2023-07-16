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
	Login    string
	Password string
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
