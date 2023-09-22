package grpc

import (
	"context"

	"github.com/nik19ta/gostat/mail_service/internal/mail/service"
	pb "github.com/nik19ta/gostat/mail_service/proto/mail"
)

type MailServiceHandler struct {
	pb.UnimplementedMailServiceServer
	service service.MailService
}

func NewMailService(s service.MailService) *MailServiceHandler {
	return &MailServiceHandler{
		service: s,
	}
}

func (h *MailServiceHandler) SendMailResetPassword(ctx context.Context, req *pb.SendMailResetPasswordRequest) (*pb.SendMailResetPasswordResponse, error) {
	err := h.service.SendMailResetPassword(req.GetEmail(), req.GetFirstName(), req.GetSecondName(), req.GetSecretCode())

	if err != nil {
		return &pb.SendMailResetPasswordResponse{Status: false}, nil
	}

	return &pb.SendMailResetPasswordResponse{Status: true}, nil
}

func (h *MailServiceHandler) SendMail(ctx context.Context, req *pb.SendMailRequest) (*pb.SendMailResponse, error) {
	err := h.service.SendMail(req.GetEmail(), req.GetFirstName(), req.GetSecondName(), req.GetSecretCode())

	if err != nil {
		return &pb.SendMailResponse{Status: false}, nil
	}

	return &pb.SendMailResponse{Status: true}, nil
}
