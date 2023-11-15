package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	appgrpc "github.com/nik19ta/gostat/api_service/internal/app/repository/grpc"
	grpc "github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	kafka "github.com/nik19ta/gostat/api_service/pkg/kafka"
	app "github.com/nik19ta/gostat/api_service/proto/app"
	auth "github.com/nik19ta/gostat/api_service/proto/auth"
)

type AuthService struct {
	client       *grpc.AuthClient
	appClient    *appgrpc.AppClient
	kafkaService *kafka.KafkaService
}

func NewAuthService(
	client *grpc.AuthClient,
	appClient *appgrpc.AppClient,
	kafkaService *kafka.KafkaService,
) *AuthService {
	return &AuthService{
		client:       client,
		appClient:    appClient,
		kafkaService: kafkaService,
	}
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type RegistrationRequest struct {
	Login      string `json:"login"`
	Mail       string `json:"mail"`
	Password   string `json:"password"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	MiddleName string `json:"middle_name"`
}

// ResetPasswordRequest represents the request body for requesting a password reset
// swagger:parameters PasswordRequest
type ResetPasswordRequest struct {
	// The email address associated with the account
	// required: true
	// example: user@example.com
	Mail string `json:"mail"`
}

// ResetConfirmPasswordRequest represents the request body for confirming a password reset
type ResetConfirmPasswordRequest struct {
	Secret      string `json:"secret"`
	Mail        string `json:"mail"`
	NewPassword string `json:"password"`
}

type Token struct {
	AccessToken  string
	RefreshToekn string
}

func (s *AuthService) Login(ctx context.Context, req LoginRequest) (*Token, error) {
	resp, err := s.client.Login(ctx, &auth.LoginRequest{
		Login:    req.Login,
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}
	return &Token{
		AccessToken:  resp.GetToken(),
		RefreshToekn: resp.GetRefreshToken(),
	}, nil
}

func (s *AuthService) RevokeToken(ctx context.Context, session string) error {
	_, err := s.client.RevokeToken(ctx, &auth.RevokeTokenRequest{
		Uuid: session,
	})

	if err != nil {
		return err
	}

	return nil
}

func (s *AuthService) RefreshToken(ctx context.Context, token string) (*string, error) {
	resp, err := s.client.RefreshToken(ctx, &auth.RefreshTokenRequest{
		RefreshToken: token,
	})

	if err != nil {
		return nil, err
	}

	newToken := resp.GetNewToken()

	return &newToken, nil
}

func (s *AuthService) SendConfirmMail(ctx context.Context, id uint64) error {
	data, updateCodeError := s.client.SetConfirmCode(ctx, &auth.SetConfirmCodeRequest{
		Id: id,
	})

	if updateCodeError != nil {
		return updateCodeError
	}

	userData, userError := s.client.GetUserInfo(ctx, &auth.GetUserInfoRequest{
		Id: id,
	})

	if userError != nil {
		return userError
	}

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	s.kafkaService.SendMessage("confirm_account_send_mail_request", requestID, SendMessageRequest{
		Email:      userData.Email,
		FirstName:  userData.FirstName,
		SecondName: userData.LastName,
		SecretCode: data.NewSecret,
	})

	return nil
}

func (s *AuthService) ConfirmAccount(ctx context.Context, secret string) error {
	resp, err := s.client.ConfirmAccount(ctx, &auth.ConfirmAccountRequest{
		Secret: secret,
	})

	if err != nil || resp.Status != true {
		return err
	}

	return nil
}

type SendMessageRequest struct {
	Email      string `json:"email"`
	FirstName  string `json:"first_name"`
	SecondName string `json:"second_name"`
	SecretCode string `json:"secret_code"`
}

func (s *AuthService) Registration(ctx context.Context, req RegistrationRequest) (*Token, error) {
	resp, err := s.client.Registration(ctx, &auth.RegistrationRequest{
		Login:      req.Login,
		Mail:       req.Mail,
		Password:   req.Password,
		FirstName:  req.FirstName,
		LastName:   req.LastName,
		MiddleName: req.MiddleName,
	})

	if resp.Status != true || err != nil {
		return nil, errors.New(resp.Text)
	}

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	s.kafkaService.SendMessage("confirm_account_send_mail_request", requestID, SendMessageRequest{
		Email:      req.Mail,
		FirstName:  req.FirstName,
		SecondName: req.LastName,
		SecretCode: resp.GetCode(),
	})

	return &Token{
		AccessToken:  resp.GetToken(),
		RefreshToekn: resp.GetRefreshToken(),
	}, nil
}

func (s *AuthService) PasswordRequest(ctx context.Context, req ResetPasswordRequest) error {

	if len(req.Mail) == 0 {
		return errors.New("Invalid mail")
	}

	resp, err := s.client.PasswordRequest(ctx, &auth.PasswordRequestRequest{Mail: req.Mail})

	if resp.Status != true || err != nil {
		return err
	}

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	s.kafkaService.SendMessage("reset_password_send_mail_request", requestID, SendMessageRequest{
		Email:      req.Mail,
		FirstName:  resp.FirstName,
		SecondName: resp.SocendName,
		SecretCode: resp.Secret,
	})

	return nil
}

func (s *AuthService) PasswordReset(ctx context.Context, req ResetConfirmPasswordRequest) (*Token, error) {
	if len(req.Mail) == 0 {
		return nil, errors.New("Invalid mail")
	}

	if len(req.NewPassword) < 8 {
		return nil, errors.New("Invalid password")
	}

	token, err := s.client.PasswordReset(ctx, &auth.PasswordResetRequest{
		Mail:     req.Mail,
		Password: req.NewPassword,
		Secret:   req.Secret,
	})

	if err != nil {
		return nil, err
	}

	return &Token{
		AccessToken:  token.Token,
		RefreshToekn: token.RefreshToken,
	}, nil
}

// UserInfo represents detailed information about a user account and associated applications
// swagger:response UserInfo
type UserInfo struct {
	// Unique identifier of the user
	// example: 168
	Id uint64 `json:"id"`
	// First name of the user
	// example: "Nikita"
	FirstName string `json:"first_name"`
	// Avatar URL
	// example: ""
	Avatar string `json:"avatar"`
	// Last name of the user
	// example: "Khvatov"
	LastName string `json:"last_name"`
	// Middle name of the user
	// example: "Dmitrievich"
	MiddleName string `json:"middle_name"`
	// Account confirmation status
	// example: false
	AccountConfirmed bool `json:"account_confirmed"`
	// Email address of the user
	// example: "nik19ta.me1@gmail.com"
	Email string `json:"email"`
	// Login name of the user
	// example: "nik19ta.me1"
	Login string `json:"login"`
	// Timestamp of account creation
	// example: "2023-10-22 00:49:35"
	CreatedAt string `json:"created_at"`
	// List of applications associated with the user
	Apps []UserApp `json:"apps"`
}

// UserApp represents an application associated with a user account
type UserApp struct {
	// Unique identifier of the application
	// example: "8d8da463-767a-488c-9cc6-45dc35346507"
	Id string `json:"id"`
	// Image or icon of the application
	// example: "default"
	Image string `json:"image"`
	// Name of the application
	// example: "nikkhvat"
	Name string `json:"name"`
	// URL of the application
	// example: "https://nik.khvat.pro"
	Url string `json:"url"`
	// Timestamp of application creation
	// example: "2023-10-22T01:47:40+04:00"
	CreatedAt string `json:"created_at"`
}

func (s *AuthService) GetInfoAccount(ctx context.Context, id uint64) (*UserInfo, error) {

	userData, userErr := s.client.GetUserInfo(ctx, &auth.GetUserInfoRequest{
		Id: id,
	})

	if userErr != nil {
		return nil, userErr
	}

	apps, appsErr := s.appClient.GetAppsByUserId(ctx, &app.GetAppsByUserIdRequest{
		UserId: id,
	})

	var userapps []UserApp

	for _, app := range apps.Apps {
		userapps = append(userapps, UserApp{
			Id:        app.Id,
			Image:     app.Image,
			Name:      app.Name,
			Url:       app.Url,
			CreatedAt: app.CreatedAt,
		})
	}

	if appsErr != nil {
		return nil, userErr
	}

	resp := UserInfo{
		Id:               id,
		FirstName:        userData.FirstName,
		Avatar:           userData.Avatar,
		LastName:         userData.LastName,
		MiddleName:       userData.MiddleName,
		AccountConfirmed: userData.AccountConfirmed,
		Email:            userData.Email,
		Login:            userData.Login,
		CreatedAt:        userData.CreatedAt,
		Apps:             userapps,
	}
	return &resp, nil
}

type UserSession struct {
	UUID      string `json:"uuid"`
	CreatedAt string `json:"created_at"`
}

	func (s *AuthService) GetUserSession(ctx context.Context, id uint64) ([]UserSession, error) {

	var sessions []UserSession

	resp, err := s.client.GetSessions(ctx, &auth.GetSessionsRequest{Id: id})

	if err != nil {
		return nil, err
	}

	for _, session := range resp.Sessions {
		sessions = append(sessions, UserSession{
			UUID:      session.Uuid,
			CreatedAt: session.CreatedAt,
		})
	}

	return sessions, nil
}
