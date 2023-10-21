package grpc

import (
	"context"
	"strconv"
	"time"

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

func (h *AppServiceHandler) GetAppsByUserId(ctx context.Context, req *pb.GetAppsByUserIdRequest) (*pb.GetAppsByUserIdResponse, error) {
	apps, err := h.service.GetAppsByUserId(req.UserId)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "unknown error: %v", err)
	}

	var appsResponse []*pb.GetAppResponse
	for _, app := range apps {
		appsResponse = append(appsResponse, &pb.GetAppResponse{
			Id:        app.ID.String(),
			UserId:    strconv.FormatUint(app.UserID, 10),
			Image:     app.Img,
			Name:      app.Name,
			Url:       app.URL,
			CreatedAt: app.CreatedAt.Format(time.RFC3339),
		})
	}

	return &pb.GetAppsByUserIdResponse{Apps: appsResponse}, nil
}
