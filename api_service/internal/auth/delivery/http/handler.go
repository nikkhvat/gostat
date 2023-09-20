package http

import (
	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/auth/service"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

// SuccessAuthResponse defines the response for a successful login
// swagger:response SuccessAuthResponse
type SuccessAuthResponse struct {
	// The generated JWT
	// in: body
	// example: "your_generated_token"
	Token string `json:"token"`
}

// ErrorAuthResponse defines a response for an error
// swagger:response ErrorAuthResponse
type ErrorAuthResponse struct {
	// Detailed error message
	// in: body
	// example: "login or password is not correct"
	Error string `json:"error"`
}

// Login                   godoc
// @Summary                Authenticate a user and get an access token
// @Description            Uses login and password for authentication to get an access token
// @Tags                   authentication
// @Accept                 json
// @Produce                json
// @Param                  LoginRequest body service.LoginRequest true "Login payload"
// @Success                200 {object} SuccessAuthResponse
// @Failure                400 {object} ErrorAuthResponse
// @Failure                401 {object} ErrorAuthResponse
// @Router                 /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	token, err := h.service.Login(c.Request.Context(), req)
	if err != nil {

		if err.Error() == "rpc error: code = NotFound desc = user not found" {
			c.JSON(401, ErrorAuthResponse{Error: "login or password is not correct"})
			return
		}

		c.JSON(500, ErrorAuthResponse{Error: err.Error()})
		return
	}

	c.JSON(200, SuccessAuthResponse{Token: token})
}

// Registration                godoc
// @Summary                    Register a new user
// @Description                Register a new user with the given details
// @Tags                       authentication
// @Accept                     json
// @Produce                    json
// @Param                      RegistrationRequest body service.RegistrationRequest true "Registration payload"
// @Success                    200 {object} SuccessAuthResponse "Example: {\"token\":\"YOUR_GENERATED_TOKEN\"}"
// @Failure                    400 {object} ErrorAuthResponse "Example: {\"error\":\"any error\"}"
// @Failure                    409 {object} ErrorAuthResponse "Example: {\"error\":\"User with the same email already exists\"}"
// @Router                     /auth/registration [post]
func (h *AuthHandler) Registration(c *gin.Context) {
	var req service.RegistrationRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.Registration(c.Request.Context(), req)
	if err != nil {
		if err.Error() == "rpc error: code = AlreadyExists desc = User with the same email already exists" {
			c.JSON(409, ErrorAuthResponse{Error: "User with the same email already exists"})
			return
		}

		if err.Error() == "rpc error: code = AlreadyExists desc = User with the same login already exists" {
			c.JSON(409, ErrorAuthResponse{Error: "User with the same login already exists"})
			return
		}

		if err.Error() == "duplicate key value violates unique constraint uix_users_email" {
			c.JSON(409, ErrorAuthResponse{Error: "duplicate key value violates unique constraint uix_users_email"})
			return
		}

		if err.Error() == "duplicate key value violates unique constraint uix_users_login" {
			c.JSON(409, ErrorAuthResponse{Error: "duplicate key value violates unique constraint uix_users_login"})
			return
		}

		c.JSON(400, ErrorAuthResponse{Error: "any error"})
		return
	}

	c.JSON(200, SuccessAuthResponse{Token: *token})
}
