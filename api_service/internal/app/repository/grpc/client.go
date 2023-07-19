package grpc

import (
	"context"
	"github.com/nik19ta/gostat/api_service/proto/app"
	"google.golang.org/grpc"
)

type AppClient struct {
	conn   *grpc.ClientConn
	client app.AppServiceClient
}

func NewAppClient(address string) (*AppClient, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	client := app.NewAppServiceClient(conn)
	return &AppClient{conn: conn, client: client}, nil
}

func (c *AppClient) CreateApp(ctx context.Context, req *app.CreateAppRequest) (*app.CreateAppResponse, error) {
	return c.client.CreateApp(ctx, req)
}
