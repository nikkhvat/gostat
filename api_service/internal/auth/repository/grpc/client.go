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

func (c *AuthClient) ConfirmAccount(ctx context.Context, req *auth.ConfirmAccountRequest) (*auth.ConfirmAccountResponse, error) {
	return c.client.ConfirmAccount(ctx, req)
}

func (c *AuthClient) Close() error {
	return c.conn.Close()
}

func (c *AuthClient) PasswordRequest(ctx context.Context, req *auth.PasswordRequestRequest) (*auth.PasswordRequestResponse, error) {
	return c.client.PasswordRequest(ctx, req)
}

func (c *AuthClient) PasswordReset(ctx context.Context, req *auth.PasswordResetRequest) (*auth.PasswordResetResponse, error) {
	return c.client.PasswordReset(ctx, req)
}

func (c *AuthClient) GetUserInfo(ctx context.Context, req *auth.GetUserInfoRequest) (*auth.GetUserInfoResponse, error) {
	return c.client.GetUserinfo(ctx, req)
}

func (c *AuthClient) SetConfirmCode(ctx context.Context, req *auth.SetConfirmCodeRequest) (*auth.SetConfirmCodeResponse, error) {
	return c.client.SetConfirmCode(ctx, req)
}

func (c *AuthClient) RevokeToken(ctx context.Context, req *auth.RevokeTokenRequest) (*auth.RevokeTokenResponse, error) {
	return c.client.RevokeToken(ctx, req)
}
