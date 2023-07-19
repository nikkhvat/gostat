package http

import (
	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/app/service"
	"net/http"
)

type AppHandler struct {
	service *service.AppService
}

func NewAppHandler(service *service.AppService) *AppHandler {
	return &AppHandler{service: service}
}

type CreateAppRequest struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

func (h *AppHandler) CreateApp(c *gin.Context) {
	var request CreateAppRequest

	id := c.GetUint64("id")

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req := service.CreateAppRequest{
		UserId: id,
		Name:   request.Name,
		URL:    request.URL,
	}

	appId, err := h.service.CreateApp(c.Request.Context(), req)

	if err != nil {
		c.JSON(400, gin.H{"error": true, "detail": err})
		return
	}

	c.JSON(200, gin.H{
		"successfully": true,
		"app_id":       appId,
	})
}
