package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	kafka "github.com/nik19ta/gostat/api_service/pkg/kafka"
	auth "github.com/nik19ta/gostat/api_service/proto/auth"
)

type AuthService struct {
	client       *grpc.AuthClient
	kafkaService *kafka.KafkaService
}

func NewAuthService(
	client *grpc.AuthClient,
	kafkaService *kafka.KafkaService,
) *AuthService {
	return &AuthService{
		client:       client,
		kafkaService: kafkaService,
	}
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

// ResetPasswordRequest represents the request body for requesting a password reset
// swagger:parameters PasswordRequest
type ResetPasswordRequest struct {
	// The email address associated with the account
	// required: true
	// example: user@example.com
	Mail string `json:"mail"`
}

// ResetConfirmPasswordRequest represents the request body for confirming a password reset
type ResetConfirmPasswordRequest struct {
	Secret      string `json:"secret"`
	Mail        string `json:"mail"`
	NewPassword string `json:"password"`
}

type Token struct {
	AccessToken  string
	RefreshToekn string
}

func (s *AuthService) Login(ctx context.Context, req LoginRequest) (*Token, error) {
	resp, err := s.client.Login(ctx, &auth.LoginRequest{
		Login:    req.Login,
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}
	return &Token{
		AccessToken:  resp.GetToken(),
		RefreshToekn: resp.GetRefreshToken(),
	}, nil
}

func (s *AuthService) RefreshToken(ctx context.Context, token string) (*string, error) {
	resp, err := s.client.RefreshToken(ctx, &auth.RefreshTokenRequest{
		RefreshToken: token,
	})

	if err != nil {
		return nil, err
	}

	newToken := resp.GetNewToken()

	return &newToken, nil
}

func (s *AuthService) ConfirmAccount(ctx context.Context, secret string) error {
	resp, err := s.client.ConfirmAccount(ctx, &auth.ConfirmAccountRequest{
		Secret: secret,
	})

	if err != nil || resp.Status != true {
		return err
	}

	return nil
}

type SendMessageRequest struct {
	Email      string `json:"email"`
	FirstName  string `json:"first_name"`
	SecondName string `json:"second_name"`
	SecretCode string `json:"secret_code"`
}

func (s *AuthService) Registration(ctx context.Context, req RegistrationRequest) (*Token, error) {
	resp, err := s.client.Registration(ctx, &auth.RegistrationRequest{
		Login:      req.Login,
		Mail:       req.Mail,
		Password:   req.Password,
		FirstName:  req.FirstName,
		LastName:   req.LastName,
		MiddleName: req.MiddleName,
	})

	if resp.Status != true || err != nil {
		return nil, errors.New(resp.Text)
	}

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	s.kafkaService.SendMessage("confirm_account_send_mail_request", requestID, SendMessageRequest{
		Email:      req.Mail,
		FirstName:  req.FirstName,
		SecondName: req.LastName,
		SecretCode: resp.GetCode(),
	})

	return &Token{
		AccessToken:  resp.GetToken(),
		RefreshToekn: resp.GetRefreshToken(),
	}, nil
}

func (s *AuthService) PasswordRequest(ctx context.Context, req ResetPasswordRequest) error {

	if len(req.Mail) == 0 {
		return errors.New("Invalid mail")
	}

	resp, err := s.client.PasswordRequest(ctx, &auth.PasswordRequestRequest{Mail: req.Mail})

	if resp.Status != true || err != nil {
		return err
	}

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	s.kafkaService.SendMessage("reset_password_send_mail_request", requestID, SendMessageRequest{
		Email:      req.Mail,
		FirstName:  resp.FirstName,
		SecondName: resp.SocendName,
		SecretCode: resp.Secret,
	})

	return nil
}

func (s *AuthService) PasswordReset(ctx context.Context, req ResetConfirmPasswordRequest) (*Token, error) {
	if len(req.Mail) == 0 {
		return nil, errors.New("Invalid mail")
	}

	if len(req.NewPassword) < 8 {
		return nil, errors.New("Invalid password")
	}

	token, err := s.client.PasswordReset(ctx, &auth.PasswordResetRequest{
		Mail:     req.Mail,
		Password: req.NewPassword,
		Secret:   req.Secret,
	})

	if err != nil {
		return nil, err
	}

	return &Token{
		AccessToken:  token.Token,
		RefreshToekn: token.RefreshToken,
	}, nil
}
