package grpc

import (
	"context"
	"github.com/nik19ta/gostat/app_service/internal/app/service"
	pb "github.com/nik19ta/gostat/app_service/proto/app"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AppServiceHandler struct {
	pb.UnimplementedAppServiceServer
	service service.AppService
}

func NewAppServiceHandler(s service.AppService) *AppServiceHandler {
	return &AppServiceHandler{
		service: s,
	}
}

func (h *AppServiceHandler) CreateApp(ctx context.Context, req *pb.CreateAppRequest) (*pb.CreateAppResponse, error) {
	uuid, err := h.service.CreateApp(req.Name, req.Url, req.UserId)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "unknown error")
	}

	return &pb.CreateAppResponse{AppId: uuid.String()}, nil
}
