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

func (h *StatsServiceHandler) GetVisits(ctx context.Context, req *pb.GetVisitsRequest) (*pb.GetVisitsResponse, error) {
	data, err := h.service.GetVisits(req.AppId)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	pages := data.TopPages // []URLCountPair
	ptrs := make([]*pb.URLCountPair, len(pages))

	for i := range pages {
		ptrs[i] = &pb.URLCountPair{
			Url:   pages[i].URL,
			Title: pages[i].Title,
			Count: pages[i].Count,
		}
	}

	return &pb.GetVisitsResponse{
		Stats: &pb.SiteStats{
			TotalVisits:    data.TotalVisits,
			TotalBots:      data.TotalBots,
			AvgDuration:    data.AvgDuration,
			FirstVisits:    data.FirstVisits,
			TopPages:       ptrs,
			TopBrowsers:    nil,
			TopCountries:   nil,
			TopOs:          nil,
			VisitsByDay:    nil,
			TotalVisitsBot: nil,
			VisitsByHour:   nil,
		},
	}, err
}
