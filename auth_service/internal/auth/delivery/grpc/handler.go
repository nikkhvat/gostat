package grpc

import (
	"context"
	"errors"

	"github.com/nik19ta/gostat/auth_service/internal/auth/service"
	pb "github.com/nik19ta/gostat/auth_service/proto/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
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

func (h *AuthServiceHandler) RefreshToken(ctx context.Context, req *pb.RefreshTokenRequest) (*pb.RefreshTokenResponse, error) {
	token, err := h.service.RefreshToken(req.GetRefreshToken())

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.RefreshTokenResponse{NewToken: token}, nil
}

func (h *AuthServiceHandler) ConfirmAccount(ctx context.Context, req *pb.ConfirmAccountRequest) (*pb.ConfirmAccountResponse, error) {
	err := h.service.ConfirmAccount(req.Secret)

	if err != nil {
		return &pb.ConfirmAccountResponse{Status: false}, err
	}

	return &pb.ConfirmAccountResponse{Status: true}, nil
}

func (h *AuthServiceHandler) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	token, err := h.service.Authenticate(req.GetLogin(), req.GetPassword())
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Errorf(codes.NotFound, "user not found")
		}
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.LoginResponse{Token: token.JWTToken, RefreshToken: token.RefreshToken}, nil
}

func (h *AuthServiceHandler) Registration(ctx context.Context, req *pb.RegistrationRequest) (*pb.RegistrationResponse, error) {
	credentials, err := h.service.Registration(req.Login, req.Mail, req.Password,
		req.FirstName, req.LastName, req.MiddleName)

	if credentials.Status != true {
		return &pb.RegistrationResponse{Status: false, Text: credentials.Text}, err
	}

	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"uix_users_email\"" {
			return nil, status.Errorf(codes.AlreadyExists, "User with the same email already exists")
		}

		if err.Error() == "pq: duplicate key value violates unique constraint \"uix_users_login\"" {
			return nil, status.Errorf(codes.AlreadyExists, "User with the same login already exists")
		}

		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.RegistrationResponse{
		Token:        credentials.Token,
		RefreshToken: credentials.RefreshToken,
		Code:         credentials.ConfirmCode,
		Status:       true,
	}, err
}
