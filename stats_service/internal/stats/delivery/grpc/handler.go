package grpc

import (
	"context"

	"github.com/nik19ta/gostat/stats_service/internal/stats/service"
	pb "github.com/nik19ta/gostat/stats_service/proto/stats"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type StatsServiceHandler struct {
	pb.UnimplementedStatsServiceServer
	service service.StatsService
}

func NewAuthServiceHandler(s service.StatsService) *StatsServiceHandler {
	return &StatsServiceHandler{
		service: s,
	}
}

func (h *StatsServiceHandler) SetVisit(ctx context.Context, req *pb.SetVisitRequest) (*pb.SetVisitResponse, error) {
	session, err := h.service.SetVisits(req.Ip, req.UserAgent, req.Utm, req.HttpReferer,
		req.Url, req.Title, req.Session, req.Unique, req.AppId)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.SetVisitResponse{Session: session}, nil
}

func (h *StatsServiceHandler) VisitExtend(ctx context.Context, req *pb.VisitExtendRequest) (*pb.VisitExtendResponse, error) {
	err := h.service.VisitExtend(req.Session)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	return &pb.VisitExtendResponse{Session: req.Session}, err
}
