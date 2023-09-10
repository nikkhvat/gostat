package grpc

import (
	"context"

	"github.com/nik19ta/gostat/api_service/proto/mail"
	"google.golang.org/grpc"
)

type MailClient struct {
	conn   *grpc.ClientConn
	client mail.MailServiceClient
}

func NewMailClient(address string) (*MailClient, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	client := mail.NewMailServiceClient(conn)
	return &MailClient{conn: conn, client: client}, nil
}

func (c *MailClient) SendMail(ctx context.Context, req *mail.SendMailRequest) (*mail.SendMailResponse, error) {
	return c.client.SendMail(ctx, req)
}

func (c *MailClient) Close() error {
	return c.conn.Close()
}
