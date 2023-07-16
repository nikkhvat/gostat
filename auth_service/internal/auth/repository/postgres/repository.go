package postgres

import (
	"github.com/jinzhu/gorm"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return UserRepository{db: db}
}

func (r UserRepository) GetUserByLoginAndPassword(login, password string) (model.User, error) {
	var user model.User
	if err := r.db.Where("login = ? AND password = ?", login, password).First(&user).Error; err != nil {
		return model.User{}, err
	}
	return user, nil
}
