package model

import (
	"github.com/google/uuid"
	"time"
)

type App struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uint64    `gorm:"not null"`
	Name      string    `gorm:"not null"`
	Img       string    `gorm:"not null"`
	URL       string    `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
