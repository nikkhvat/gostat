package grpc

import (
	"context"

	"github.com/nik19ta/gostat/api_service/proto/auth"
	"google.golang.org/grpc"
)

type AuthClient struct {
	conn   *grpc.ClientConn
	client auth.AuthServiceClient
}

func NewAuthClient(address string) (*AuthClient, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	client := auth.NewAuthServiceClient(conn)
	return &AuthClient{conn: conn, client: client}, nil
}

func (c *AuthClient) Login(ctx context.Context, req *auth.LoginRequest) (*auth.LoginResponse, error) {
	return c.client.Login(ctx, req)
}

func (c *AuthClient) Registration(ctx context.Context, req *auth.RegistrationRequest) (*auth.RegistrationResponse, error) {
	return c.client.Registration(ctx, req)
}

func (c *AuthClient) RefreshToken(ctx context.Context, req *auth.RefreshTokenRequest) (*auth.RefreshTokenResponse, error) {
	return c.client.RefreshToken(ctx, req)
}

func (c *AuthClient) Close() error {
	return c.conn.Close()
}
