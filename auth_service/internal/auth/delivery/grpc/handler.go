package grpc

import (
	"context"

	"github.com/nik19ta/gostat/auth_service/internal/auth/service"
	pb "github.com/nik19ta/gostat/auth_service/proto/auth"
)

type AuthServiceHandler struct {
	pb.UnimplementedAuthServiceServer
	service service.AuthService
}

func NewAuthServiceHandler(s service.AuthService) *AuthServiceHandler {
	return &AuthServiceHandler{
		service: s,
	}
}

func (h *AuthServiceHandler) Login(ctx context.Context, in *pb.LoginRequest) (*pb.LoginResponse, error) {
	token, err := h.service.Login(in.Login, in.Password)
	if err != nil {
		return nil, err
	}
	return &pb.LoginResponse{Token: token}, nil
}
