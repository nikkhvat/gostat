package service

import (
	"context"

	"github.com/nik19ta/gostat/api_service/internal/app/repository/grpc"
	"github.com/nik19ta/gostat/api_service/proto/app"

	grpcStats "github.com/nik19ta/gostat/api_service/internal/stats/repository/grpc"
	"github.com/nik19ta/gostat/api_service/proto/stats"
)

type AppService struct {
	client      *grpc.AppClient
	statsClient *grpcStats.StatsClient
}

func NewAppService(client *grpc.AppClient, statsClient *grpcStats.StatsClient) *AppService {
	return &AppService{
		client:      client,
		statsClient: statsClient,
	}
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

type DeleteAppRequest struct {
	UserId uint64 `json:"user_id"`
	AppId  string `json:"app_id"`
}

func (s *AppService) DeleteApp(ctx context.Context, req DeleteAppRequest) error {

	deleteAppErr, err := s.client.DeleteApp(ctx, &app.DeleteAppRequest{
		AppId:  req.AppId,
		UserId: req.UserId,
	})

	if err != nil || deleteAppErr.Successful == false {
		return err
	}

	deleteStatsErr, err := s.statsClient.DeleteApp(ctx, &stats.DeleteByAppIdRequest{
		AppId:  req.AppId,
		UserId: req.UserId,
	})

	if err != nil || deleteStatsErr.Successful == false {
		return err
	}

	return nil
}
