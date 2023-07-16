package grpc

import (
	"context"

	"github.com/jinzhu/gorm"
	"github.com/nik19ta/gostat/auth_service/internal/auth/service"
	pb "github.com/nik19ta/gostat/auth_service/proto/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
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

func (h *AuthServiceHandler) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	token, err := h.service.Authenticate(req.GetLogin(), req.GetPassword())
	if err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, status.Errorf(codes.NotFound, "user not found")
		}
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.LoginResponse{Token: token}, nil
}

func (h *AuthServiceHandler) Registration(ctx context.Context, req *pb.RegistrationRequest) (*pb.RegistrationResponse, error) {
	token, err := h.service.Registration(req.Login, req.Mail, req.Password,
		req.FirstName, req.LastName, req.MiddleName)

	if err != nil {

		if err.Error() == "pq: duplicate key value violates unique constraint \"uix_users_email\"" {
			return nil, status.Errorf(codes.AlreadyExists, "User with the same email already exists")
		}

		if err.Error() == "pq: duplicate key value violates unique constraint \"uix_users_login\"" {
			return nil, status.Errorf(codes.AlreadyExists, "User with the same login already exists")
		}

		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.RegistrationResponse{Token: token}, err
}
