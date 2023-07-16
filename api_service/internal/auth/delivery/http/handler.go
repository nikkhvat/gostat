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

func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.Login(c.Request.Context(), req)
	if err != nil {

		if err.Error() == "rpc error: code = NotFound desc = user not found" {
			c.JSON(401, gin.H{"error": "login or password is not correct"})
			return
		}

		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"token": token})
}

func (h *AuthHandler) Registration(c *gin.Context) {
	var req service.RegistrationRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.Registration(c.Request.Context(), req)
	if err != nil {

		if err.Error() == "rpc error: code = AlreadyExists desc = User with the same email already exists" {
			c.JSON(409, gin.H{"error": "User with the same email already exists"})
			return
		}

		if err.Error() == "rpc error: code = AlreadyExists desc = User with the same login already exists" {
			c.JSON(409, gin.H{"error": "User with the same login already exists"})
			return
		}

		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"token": token})
}
