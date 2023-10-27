package postgres

import (
	"time"

	"github.com/nik19ta/gostat/stats_service/internal/stats/model"
	"gorm.io/gorm"
)

type StatsRepository struct {
	db *gorm.DB
}

func NewStatsRepository(db *gorm.DB) StatsRepository {
	return StatsRepository{db: db}
}

func (r StatsRepository) GetVisits(app_id string) ([]model.Visits, error) {
	timeBoundary := time.Now().AddDate(0, 0, -30)

	var visits []model.Visits
	r.db.Where("time_entry > ?", timeBoundary).Where("app_id = ?", app_id).Find(&visits)

	return visits, nil
}

type Project struct {
	UUID string `json:"uuid"`
}

func (r StatsRepository) AddVisit(data model.Visits) error {
	result := r.db.Create(&data)

	return result.Error
}

func (r StatsRepository) VisitExtend(session string) error {
	var lastVisit model.Visits

	err := r.db.Model(&model.Visits{}).Where("session = ?", session).Order("time_entry desc").First(&lastVisit).Error
	if err != nil {
		return err
	}

	result := r.db.Model(&model.Visits{}).Where("uid = ?", lastVisit.UId).Update("time_leaving", time.Now())

	return result.Error
}

func (r StatsRepository) DeleteByAppId(appId string) error {
	result := r.db.Where("app_id = ?", appId).Delete(&model.Visits{})

	if result.Error != nil {
		return result.Error
	}
	return nil
}
