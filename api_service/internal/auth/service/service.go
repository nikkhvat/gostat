package service

import (
	"context"
	"errors"

	"github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	grpcMail "github.com/nik19ta/gostat/api_service/internal/mail/repository/grpc"
	auth "github.com/nik19ta/gostat/api_service/proto/auth"
	mail "github.com/nik19ta/gostat/api_service/proto/mail"
)

type AuthService struct {
	client     *grpc.AuthClient
	mailClient *grpcMail.MailClient
}

func NewAuthService(client *grpc.AuthClient, mailClient *grpcMail.MailClient) *AuthService {
	return &AuthService{
		client:     client,
		mailClient: mailClient,
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

func (s *AuthService) Registration(ctx context.Context, req RegistrationRequest) (*Token, error) {
	resp, err := s.client.Registration(ctx, &auth.RegistrationRequest{
		Login:      req.Login,
		Mail:       req.Mail,
		Password:   req.Password,
		FirstName:  req.FirstName,
		LastName:   req.LastName,
		MiddleName: req.MiddleName,
	})

	if resp.Status != true {
		return nil, errors.New(resp.Text)
	}

	mailStatus, err := s.mailClient.SendMail(ctx, &mail.SendMailRequest{
		Email:      req.Mail,
		FirstName:  req.FirstName,
		SecondName: req.LastName,
		SecretCode: resp.GetCode(),
	})

	if err != nil {
		return nil, err
	}

	if mailStatus.Status != true {
		return nil, errors.New("error send email")
	}

	return &Token{
		AccessToken:  resp.GetToken(),
		RefreshToekn: resp.GetRefreshToken(),
	}, nil
}
