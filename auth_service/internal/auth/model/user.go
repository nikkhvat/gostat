package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email                string `gorm:"type:varchar(100);unique"`
	Login                string `gorm:"type:varchar(100);unique"`
	Password             string `gorm:"type:varchar(100)"`
	Avatar               string `gorm:"type:varchar(255);default:''"`
	FirstName            string `gorm:"type:varchar(100)"`
	LastName             string `gorm:"type:varchar(100)"`
	MiddleName           string `gorm:"type:varchar(100)"`
	Code                 string `gorm:"type:varchar(100)"`
	AccountConfirmed     bool   `gorm:"default:false"`
	PasswordRecoveryCode string `gorm:"type:varchar(255);default:''"`
}

type UserClaims struct {
	Id    float64 `json:"id"`
	Login string  `json:"login"`
}
