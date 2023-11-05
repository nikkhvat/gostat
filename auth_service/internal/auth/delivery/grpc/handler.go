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

func (h *AuthServiceHandler) PasswordRequest(ctx context.Context, req *pb.PasswordRequestRequest) (*pb.PasswordRequestResponse, error) {
	user, err := h.service.PasswordRequest(req.Mail)

	if err != nil {
		return &pb.PasswordRequestResponse{Status: false}, err
	}

	return &pb.PasswordRequestResponse{
		Status:     true,
		Secret:     user.PasswordRecoveryCode,
		FirstName:  user.FirstName,
		SocendName: user.LastName,
	}, nil
}

func (h *AuthServiceHandler) PasswordReset(ctx context.Context, req *pb.PasswordResetRequest) (*pb.PasswordResetResponse, error) {
	token, err := h.service.PasswordReset(req.Secret, req.Mail, req.Password)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.PasswordResetResponse{
		RefreshToken: token.RefreshToken,
		Token:        token.JWTToken,
	}, nil
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

func (h *AuthServiceHandler) GetUserinfo(ctx context.Context, req *pb.GetUserInfoRequest) (*pb.GetUserInfoResponse, error) {
	user, err := h.service.GetUserInfo(req.Id)

	if err != nil {
		return nil, err
	}

	return &pb.GetUserInfoResponse{
		Avatar:           user.Avatar,
		FirstName:        user.FirstName,
		LastName:         user.LastName,
		MiddleName:       user.MiddleName,
		AccountConfirmed: user.AccountConfirmed,
		Email:            user.Email,
		Login:            user.Login,
		CreatedAt:        user.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (h *AuthServiceHandler) SetConfirmCode(ctx context.Context, req *pb.SetConfirmCodeRequest) (*pb.SetConfirmCodeResponse, error) {
	code, err := h.service.SetNewConfirmCode(req.Id)

	if err != nil {
		return nil, err
	}

	return &pb.SetConfirmCodeResponse{
		NewSecret: *code,
	}, nil
}
