package postgres

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/nik19ta/gostat/app_service/internal/app/model"
	"gorm.io/gorm"
)

type AppRepository struct {
	db *gorm.DB
}

func NewAppRepository(db *gorm.DB) AppRepository {
	return AppRepository{db: db}
}

func (r AppRepository) CreateApp(name, url string, userId uint64) (*model.App, error) {
	app := model.App{
		ID:        uuid.New(),
		UserID:    userId,
		Name:      name,
		URL:       url,
		Img:       "default",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result := r.db.Create(&app)

	if result.Error != nil {
		return nil, result.Error
	}

	return &app, nil
}

func (r AppRepository) GetAppsByUserId(userId uint64) ([]*model.App, error) {
	var apps []*model.App

	result := r.db.Where("user_id = ?", userId).Find(&apps)

	if result.Error != nil {
		return nil, result.Error
	}

	return apps, nil
}

func (r AppRepository) DeleteApp(userId uint64, appId string) error {
	result := r.db.Where("id = ? AND user_id = ?", appId, userId).Delete(&model.App{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no record found for the given user ID and app ID")
	}

	return nil
}
