package service

import (
	"github.com/google/uuid"
	"github.com/nik19ta/gostat/app_service/internal/app/repository/postgres"
)

type AppService struct {
	repo postgres.AppRepository
}

func NewAppService(r postgres.AppRepository) AppService {
	return AppService{repo: r}
}

func (s AppService) CreateApp(name, url string, userId uint64) (*uuid.UUID, error) {
	app, err := s.repo.CreateApp(name, url, userId)

	if err != nil {
		return nil, err
	}

	return &app.ID, nil
}
