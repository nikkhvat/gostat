package postgres

import (
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
