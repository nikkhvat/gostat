package service

import (
	"context"

	"github.com/nik19ta/gostat/api_service/internal/stats/repository/grpc"
	"github.com/nik19ta/gostat/api_service/proto/stats"
)

type StatsService struct {
	client *grpc.StatsClient
}

func NewStatsService(client *grpc.StatsClient) *StatsService {
	return &StatsService{client: client}
}

type AddVisitRequest struct {
	IP          string `json:"ip"`
	UserAgent   string `json:"user_agent"`
	UTM         string `json:"utm"`
	HTTPReferer string `json:"httpReferer"`
	URL         string `json:"url"`
	Title       string `json:"title"`
	Session     string `json:"session"`
	Unique      bool   `json:"unique"`
	AppId       string `json:"appId"`
}

type VisitExtendRequest struct {
	Session string `json:"session"`
}

func (s *StatsService) AddVisit(ctx context.Context, req AddVisitRequest) (string, error) {
	resp, err := s.client.AddVisit(ctx, &stats.SetVisitRequest{
		Ip:          req.IP,
		UserAgent:   req.UserAgent,
		Utm:         req.UTM,
		HttpReferer: req.HTTPReferer,
		Url:         req.URL,
		Title:       req.Title,
		Session:     req.Session,
		Unique:      req.Unique,
		AppId:       req.AppId,
	})

	if err != nil {
		return "", err
	}
	return resp.GetSession(), nil
}

func (s *StatsService) VisitExtend(ctx context.Context, req VisitExtendRequest) error {
	_, err := s.client.VisitExtend(ctx, &stats.VisitExtendRequest{
		Session: req.Session,
	})

	return err
}
