package http

import (
	"log"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/auth/service"
	"github.com/nik19ta/gostat/api_service/pkg/env"
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
	AccessToken string `json:"access_token"`
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
// @Summary                Authenticate a user and get access token
// @Description            Uses (login or email) and password for authentication to get access token
// @Tags                   authentication
// @Accept                 json
// @Produce                json
// @Param                  LoginRequest body service.LoginRequest true "Login payload"
// @Success                200 {object} SuccessAuthResponse
// @Failure                400 {object} ErrorAuthResponse
// @Router                 /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	token, err := h.service.Login(c.Request.Context(), req)

	if err != nil {

		if strings.Contains(err.Error(), "user not found") {
			c.JSON(400, ErrorAuthResponse{Error: "login or password is not correct"})
			return
		}

		if strings.Contains(err.Error(), "invalid password") {
			c.JSON(400, ErrorAuthResponse{Error: "login or password is not correct"})
			return
		}

		c.JSON(500, ErrorAuthResponse{Error: err.Error()})
		return
	}

	// set cookie
	cookieHttpsStr := env.Get("COOKIE_HTTPS")
	cookieHttps, err := strconv.ParseBool(cookieHttpsStr)

	if err != nil {
		c.JSON(500, ErrorAuthResponse{Error: "Error COOKIE_HTTPS not bool"})
		return
	}

	c.SetCookie("refresh_token", token.RefreshToekn, 2592000, "/", env.Get("DOMAIN"), cookieHttps, true)
	c.JSON(200, SuccessAuthResponse{AccessToken: token.AccessToken})
}

// RefreshToken                godoc
// @Summary                    Refresh the access token
// @Description                Uses the refresh token to generate a new access token
// @Tags                       authentication
// @Accept                     json
// @Produce                    json
// @Success                    200 {object} SuccessAuthResponse "Example: {\"access_token\":\"your_new_generated_token\"}"
// @Failure                    401 {object} ErrorAuthResponse "Example: {\"error\":\"Invalid refresh token\"}"
// @Router                     /auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")

	// refreshToken := c.GetHeader("Authorization")
	log.Println("refreshToken", refreshToken, len(refreshToken) == 0)

	if len(refreshToken) == 0 {
		c.JSON(401, ErrorAuthResponse{Error: "Invalid refresh token"})
		return
	}

	log.Println("refreshToken", refreshToken)
	token, err := h.service.RefreshToken(c.Request.Context(), refreshToken)

	log.Println(err)

	if err != nil {
		c.JSON(401, ErrorAuthResponse{Error: "Invalid refresh token"})
		return
	}

	c.JSON(200, SuccessAuthResponse{AccessToken: *token})
}

// SuccessAuthConfirmResponse defines the response for a successful account confirmation
// swagger:response SuccessAuthConfirmResponse
type SuccessAuthConfirmResponse struct {
	// Indicates whether the confirmation was successful
	// example: true
	Successful bool `json:"successful"`
}

// ConfirmAccount              godoc
// @Summary                    Confirm the email of an account
// @Description                Uses the secret provided in the URL to confirm the email of an account
// @Tags                       authentication
// @Accept                     json
// @Produce                    json
// @Param                      secret query string true "Secret key for account confirmation"
// @Success                    200 {object} SuccessAuthConfirmResponse "Example: {\"successful\":true}"
// @Failure                    401 {object} ErrorAuthResponse "Example: {\"error\":\"Invalid secret\"}"
// @Failure                    401 {object} ErrorAuthResponse "Example: {\"error\":\"Unexpected error, failed to verify account\"}"
// @Router                     /auth/confirm [post]
func (h *AuthHandler) ConfirmAccount(c *gin.Context) {
	secret := c.DefaultQuery("secret", "")

	if len(secret) == 0 {
		c.JSON(401, ErrorAuthResponse{Error: "Invalid secret"})
		return
	}

	err := h.service.ConfirmAccount(c, secret)

	if err != nil {
		c.JSON(401, ErrorAuthResponse{Error: "Unexpected error, failed to verify account"})
		return
	}

	c.JSON(200, SuccessAuthConfirmResponse{Successful: true})
}

// ConfirmAccount              godoc
// @Summary                    Send confirmation email
// @Description                Send an email with a code in order to confirm the account
// @Tags                       authentication
// @Accept                     json
// @Produce                    json
// @Security                   BearerAuth
// @Success                    200 {object} SuccessAuthConfirmResponse "Example: {\"successful\":true}"
// @Failure                    401 {object} ErrorAuthResponse "Example: {\"error\":\"Invalid token\"}"
// @Failure                    400 {object} ErrorAuthResponse "Example: {\"error\":\"Unexpected error, failed to send mail\"}"
// @Router                     /auth/confirm/mail [post]
func (h *AuthHandler) ConfirmSendAccount(c *gin.Context) {
	id := c.GetUint64("id")

	log.Println(id)

	err := h.service.SendConfirmMail(c, id)

	if err != nil {
		c.JSON(401, ErrorAuthResponse{Error: "Unexpected error, failed to send mail"})
		return
	}

	c.JSON(200, SuccessAuthConfirmResponse{Successful: true})
}

// RevokeToken                   godoc
// @Summary                      Revoke a user's session token
// @Description                  Accepts a session identifier in UUID format and revokes it to invalidate the session
// @Tags                         authentication
// @Accept                       json
// @Produce                      json
// @Security                     BearerAuth
// @Param                        session path string true "Session Identifier (UUID)"
// @Success                      200 {object} SuccessAuthConfirmResponse "Example: {\"successful\":true}"
// @Failure                      400 {object} ErrorAuthResponse "Example: {\"error\":\"Unexpected error, failed to revoke token\"}"
// @Router                       /auth/token/revoke/{session} [post]
func (h *AuthHandler) RevokeToken(c *gin.Context) {
	session := c.Param("session")

	err := h.service.RevokeToken(c, session)

	if err != nil {
		log.Println(err)
		c.JSON(400, ErrorAuthResponse{Error: "Unexpected error, failed to revoke token"})
		return
	}

	c.JSON(200, SuccessAuthConfirmResponse{Successful: true})
}

// Sessions                      godoc
// @Summary                      Retrieve all sessions of a user
// @Description                  Returns all the sessions associated with a user, identified by their ID
// @Tags                         authentication
// @Accept                       json
// @Produce                      json
// @Security                     BearerAuth
// @Success                      200 {array} service.UserSession "List of user sessions with details"
// @Failure                      400 {object} ErrorAuthResponse "Example: {\"error\":\"error message describing why the retrieval failed\"}"
// @Router                       /auth/sessions [get]
func (h *AuthHandler) Sessions(c *gin.Context) {
	id := c.GetUint64("id")

	data, err := h.service.GetUserSession(c, id)

	if err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	c.JSON(200, data)
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
		if strings.Contains(err.Error(), "email already exists") {
			c.JSON(409, ErrorAuthResponse{Error: "email already in exists"})
			return
		}

		if strings.Contains(err.Error(), "login already exists") {
			c.JSON(409, ErrorAuthResponse{Error: "login already in exists"})
			return
		}

		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_key\"") {
			c.JSON(409, ErrorAuthResponse{Error: "email already in exists"})
			return
		}

		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"uix_users_login\"") {
			c.JSON(409, ErrorAuthResponse{Error: "login already in exists"})
			return
		}

		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	// set cookie
	cookieHttpsStr := env.Get("COOKIE_HTTPS")
	cookieHttps, err := strconv.ParseBool(cookieHttpsStr)
	if err != nil {
		c.JSON(500, ErrorAuthResponse{Error: "Error COOKIE_HTTPS not bool"})
		return
	}

	c.SetCookie("refresh_token", token.RefreshToekn, 2592000, "/", env.Get("DOMAIN"), cookieHttps, true)
	// set cookie

	c.JSON(200, SuccessAuthResponse{AccessToken: token.AccessToken})
}

// PasswordRequest sends a password reset email to the user
// @Summary Request Password Reset
// @Description Sends a password reset email to the user.
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body service.ResetPasswordRequest true "Request body"
// @Success 200 {object} SuccessAuthConfirmResponse "Password reset email sent successfully"
// @Failure 400 {object} ErrorAuthResponse "Invalid request body or an error occurred while sending the email"
// @Router /auth/password/request [post]
func (h *AuthHandler) PasswordRequest(c *gin.Context) {
	var req service.ResetPasswordRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	err := h.service.PasswordRequest(c, req)

	if err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	c.JSON(200, SuccessAuthConfirmResponse{Successful: true})
}

// PasswordReset resets the user's password
// @Summary Reset Password
// @Description Resets the user's password using a secret token sent to their email.
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body service.ResetConfirmPasswordRequest true "Request body"
// @Success 200 {object} SuccessAuthResponse "Password reset successfully"
// @Failure 400 {object} ErrorAuthResponse "Invalid request body or an error occurred while resetting the password"
// @Router /auth/password/reset [post]
func (h *AuthHandler) PasswordReset(c *gin.Context) {
	var req service.ResetConfirmPasswordRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	token, err := h.service.PasswordReset(c, req)

	if strings.Contains(err.Error(), "no user found with the provided email and secret code") {
		c.JSON(400, ErrorAuthResponse{Error: "invalid secret code"})
		return
	}

	if err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	// set cookie
	cookieHttpsStr := env.Get("COOKIE_HTTPS")
	cookieHttps, err := strconv.ParseBool(cookieHttpsStr)
	if err != nil {
		c.JSON(500, ErrorAuthResponse{Error: "Error COOKIE_HTTPS not bool"})
		return
	}

	c.SetCookie("refresh_token", token.RefreshToekn, 2592000, "/", env.Get("DOMAIN"), cookieHttps, true)
	// set cookie

	c.JSON(200, SuccessAuthResponse{AccessToken: token.AccessToken})
}

// GetInfoAccount fetches detailed information about a user account and associated applications
// @Summary Retrieve user account information
// @Description Get detailed information about a user's account and their associated applications
// @Tags authentication
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} service.UserInfo "Successfully retrieved user information"
// @Failure 400 {object} ErrorAuthResponse "Invalid request parameters or error retrieving user information"
// @Failure 401 {object} ErrorAuthResponse "Example: {\"Invalid token\"}"
// @Router /auth/info [get]
func (h *AuthHandler) GetInfoAccount(c *gin.Context) {
	id := c.GetUint64("id")

	data, err := h.service.GetInfoAccount(c, id)

	if err != nil {
		c.JSON(400, ErrorAuthResponse{Error: err.Error()})
		return
	}

	c.JSON(200, data)
}
