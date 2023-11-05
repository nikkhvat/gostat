package grpc

import (
	"context"

	"github.com/nik19ta/gostat/api_service/proto/stats"
	"google.golang.org/grpc"
)

type StatsClient struct {
	conn   *grpc.ClientConn
	client stats.StatsServiceClient
}

func NewStatsClient(address string) (*StatsClient, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	client := stats.NewStatsServiceClient(conn)
	return &StatsClient{conn: conn, client: client}, nil
}

func (c *StatsClient) AddVisit(ctx context.Context, req *stats.SetVisitRequest) (*stats.SetVisitResponse, error) {
	return c.client.SetVisit(ctx, req)
}

func (c *StatsClient) VisitExtend(ctx context.Context, req *stats.VisitExtendRequest) (*stats.VisitExtendResponse, error) {
	return c.client.VisitExtend(ctx, req)
}

func (c *StatsClient) GetVisits(ctx context.Context, req *stats.GetVisitsRequest) (*stats.GetVisitsResponse, error) {
	return c.client.GetVisits(ctx, req)
}

func (c *StatsClient) DeleteApp(ctx context.Context, req *stats.DeleteByAppIdRequest) (*stats.DeleteByAppIdResponse, error) {
	return c.client.DeleteByAppId(ctx, req)
}

func (c *StatsClient) Close() error {
	return c.conn.Close()
}
