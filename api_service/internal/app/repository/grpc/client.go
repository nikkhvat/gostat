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

func (c *AppClient) GetAppsByUserId(ctx context.Context, req *app.GetAppsByUserIdRequest) (*app.GetAppsByUserIdResponse, error) {
	return c.client.GetAppsByUserId(ctx, req)
}

func (c *AppClient) DeleteApp(ctx context.Context, req *app.DeleteAppRequest) (*app.DeleteAppResponse, error) {
	return c.client.DeleteApp(ctx, req)
}
