package service

import (
	"time"

	"github.com/google/uuid"
	"github.com/ip2location/ip2location-go"
	"github.com/mssola/useragent"

	"github.com/nik19ta/gostat/stats_service/internal/stats/model"
	"github.com/nik19ta/gostat/stats_service/internal/stats/repository/postgres"
)

type StatsService struct {
	repo postgres.StatsRepository
}

func NewStatsService(r postgres.StatsRepository) StatsService {
	return StatsService{repo: r}
}

func countryDefinition(ip string) string {
	if ip == "" {
		return "-"
	}

	db, err := ip2location.OpenDB("")

	if err != nil {
		return "-"
	}
	defer db.Close()

	results, err := db.Get_country_short(ip)

	if err != nil {
		return "-"
	}

	return results.Country_short
}

func (s StatsService) SetVisits(ip, userAgent, utm, httpReferer, url, title string, session string, unique bool) (string, error) {
	ua := useragent.New(userAgent)

	var userSession string

	if session == "" {
		userSession = uuid.New().String()
	} else {
		userSession = session
	}

	browserName, _ := ua.Browser()

	country := countryDefinition(ip)

	ua.Model()

	data := model.Visits{
		UId:         uuid.New().String(),
		Session:     userSession,
		TimeEntry:   time.Now(),
		Browser:     browserName,
		Platform:    ua.Platform(),
		Os:          ua.OS(),
		TimeLeaving: time.Now(),
		Country:     country,
		Unique:      unique,
		Ip:          ip,
		Utm:         utm,
		URL:         url,
		Title:       title,
		HTTPReferer: httpReferer,
		AppId:       "APP_ID_TEMP", // ! REMOVE APP_ID_TEMP when make app_service
	}

	err := s.repo.AddVisit(data)

	return userSession, err
}

func (s StatsService) VisitExtend(session string) error {
	return s.repo.VisitExtend(session)
}
