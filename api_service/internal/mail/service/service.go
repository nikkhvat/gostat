package service

import (
	"context"
	"github.com/nik19ta/gostat/api_service/proto/mail"

	"github.com/nik19ta/gostat/api_service/internal/mail/repository/grpc"
)

type MailService struct {
	client *grpc.MailClient
}

func NewMailService(client *grpc.MailClient) *MailService {
	return &MailService{client: client}
}

type VisitExtendRequest struct {
	Session string `json:"session"`
}

type MailRequest struct {
	Email      string `json:"email"`
	FirstName  string `json:"first_name"`
	SecondName string `json:"second_name"`
	SecretCode string `json:"secret_code"`
}

func (s *MailService) SendMail(ctx context.Context, req MailRequest) (interface{}, error) {
	data, err := s.client.SendMail(ctx, &mail.SendMailRequest{
		Email:      req.Email,
		FirstName:  req.FirstName,
		SecondName: req.SecondName,
		SecretCode: req.SecretCode,
	})

	return data, err
}
