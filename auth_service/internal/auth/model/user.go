package model

import (
	"github.com/jinzhu/gorm"
)

// Ваша модель пользователя
type User struct {
	gorm.Model
	Email      string `gorm:"type:varchar(100);unique_index"`
	Login      string `gorm:"type:varchar(100);unique_index"`
	Password   string `gorm:"type:varchar(100)"`
	Avatar     string `gorm:"type:varchar(255);default:''"`
	FirstName  string `gorm:"type:varchar(100)"`
	LastName   string `gorm:"type:varchar(100)"`
	MiddleName string `gorm:"type:varchar(100)"`
}
