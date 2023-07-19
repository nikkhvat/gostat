package service

import (
	"context"
	"github.com/nik19ta/gostat/api_service/internal/app/repository/grpc"
	"github.com/nik19ta/gostat/api_service/proto/app"
)

type AppService struct {
	client *grpc.AppClient
}

func NewAppService(client *grpc.AppClient) *AppService {
	return &AppService{client: client}
}

type CreateAppRequest struct {
	UserId uint64 `json:"user_id"`
	URL    string `json:"url"`
	Name   string `json:"name"`
}

type VisitExtendRequest struct {
	Session string `json:"session"`
}

func (s *AppService) CreateApp(ctx context.Context, req CreateAppRequest) (string, error) {
	resp, err := s.client.CreateApp(ctx, &app.CreateAppRequest{
		Url:    req.URL,
		Name:   req.Name,
		UserId: req.UserId,
	})

	if err != nil {
		return "", err
	}
	return resp.GetAppId(), nil
}
