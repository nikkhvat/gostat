package postgres

import (
	"github.com/google/uuid"
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

func (r UserRepository) RegistrationUser(login, mail, password, firstName, lastName, middleName string) (model.User, error) {

	user := model.User{
		Email:            mail,
		Login:            login,
		Password:         password,
		FirstName:        firstName,
		LastName:         lastName,
		MiddleName:       middleName,
		Code:             uuid.New().String(),
		AccountConfirmed: false,
	}

	if err := r.db.Create(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}
