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

func NewStatsServiceHandler(s service.StatsService) *StatsServiceHandler {
	return &StatsServiceHandler{
		service: s,
	}
}

func (h *StatsServiceHandler) GetVisits(ctx context.Context, req *pb.GetVisitsRequest) (*pb.GetVisitsResponse, error) {
	data, err := h.service.GetVisits(req.AppId)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "internal error")
	}

	// * convertedPages data.TopPages
	pages := data.TopPages // []URLCountPair
	convertedPages := make([]*pb.URLCountPair, len(pages))

	for i := range pages {
		convertedPages[i] = &pb.URLCountPair{
			Url:   pages[i].URL,
			Title: pages[i].Title,
			Count: pages[i].Count,
		}
	}

	// * convertedTopBrowsers data.TopBrowsers
	browsers := data.TopBrowsers
	convertedTopBrowsers := make([]*pb.BrowserCount, len(browsers))

	for i := range browsers {
		convertedTopBrowsers[i] = &pb.BrowserCount{
			Name:  browsers[i].Name,
			Count: browsers[i].Count,
		}
	}

	// * convertedTopCountries data.TopCountries
	countries := data.TopCountries
	convertedTopCountries := make([]*pb.NameCountPair, len(countries))

	for i := range countries {
		convertedTopCountries[i] = &pb.NameCountPair{
			Name:  countries[i].Name,
			Count: int32(countries[i].Count),
		}
	}

	// * convertedTopOs data.TopOs
	os := data.TopOS
	convertedTopOs := make([]*pb.NameCountPair, len(os))

	for i := range os {
		convertedTopOs[i] = &pb.NameCountPair{
			Name:  os[i].Name,
			Count: int32(os[i].Count),
		}
	}

	//* convertedDayVisits data.VisitsByDay
	dayVisits := data.FirstVisitsByDay
	convertedDayVisits := make([]*pb.DateCountPair, len(dayVisits))

	for i := range dayVisits {
		convertedDayVisits[i] = &pb.DateCountPair{
			Date:  dayVisits[i].Date,
			Count: dayVisits[i].Count,
		}
	}

	// * convertedBotDayVisits data.VisitsBotByDay
	dayBotVisits := data.VisitsBotByDay
	convertedBotDayVisits := make([]*pb.Bot, len(dayBotVisits))

	for i := range dayBotVisits {
		var details []*pb.Entry

		for j := range dayBotVisits[i].Details {
			details = append(details, &pb.Entry{
				Count: dayBotVisits[i].Details[j].Count,
				Name:  dayBotVisits[i].Details[j].Name,
			})
		}

		convertedBotDayVisits[i] = &pb.Bot{
			Date:    dayBotVisits[i].Date,
			Details: details,
			Total:   dayBotVisits[i].Total,
		}
	}

	// date.VisitsByHour
	VisitsByHour := data.VisitsByHour
	convertedVisitsByHour := make([]*pb.TimeCountPair, len(VisitsByHour))

	for i := range VisitsByHour {
		convertedVisitsByHour[i] = &pb.TimeCountPair{
			Time:  VisitsByHour[i].Time,
			Count: VisitsByHour[i].Count,
		}
	}

	return &pb.GetVisitsResponse{
		Stats: &pb.SiteStats{
			TotalVisits:    data.TotalVisits,
			TotalBots:      data.TotalBots,
			AvgDuration:    data.AvgDuration,
			FirstVisits:    data.FirstVisits,
			TopPages:       convertedPages,
			TopBrowsers:    convertedTopBrowsers,
			TopCountries:   convertedTopCountries,
			TopOs:          convertedTopOs,
			VisitsByDay:    convertedDayVisits,
			TotalVisitsBot: convertedBotDayVisits,
			VisitsByHour:   convertedVisitsByHour,
		},
	}, err
}

func (h *StatsServiceHandler) DeleteByAppId(ctx context.Context, req *pb.DeleteByAppIdRequest) (*pb.DeleteByAppIdResponse, error) {
	err := h.service.DeleteByAppId(req.AppId)

	if err != nil {
		return &pb.DeleteByAppIdResponse{
			Successful: false,
		}, err
	}

	return &pb.DeleteByAppIdResponse{
		Successful: true,
	}, nil
}
