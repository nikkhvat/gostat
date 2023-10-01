package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/app/service"
)

type AppHandler struct {
	service *service.AppService
}

func NewAppHandler(service *service.AppService) *AppHandler {
	return &AppHandler{service: service}
}

// CreateAppRequest struct
type CreateAppRequest struct {
	// Application name
	// example: "My App"
	Name string `json:"name"`
	// Application URL
	// example: "https://myapp.com"
	URL string `json:"url"`
}

// SuccessAppCreateResponse struct
type SuccessAppCreateResponse struct {
	// Indicates successful app creation
	// example: true
	Successfully bool `json:"successfully"`
	// New application ID
	// example: "new_app_id"
	App string `json:"app"`
}

// ErrorAppCreateResponse struct
type ErrorAppCreateResponse struct {
	// Indicates an error occurred
	// example: true
	Error bool `json:"error"`
	// Detailed error message
	// example: "detailed error message"
	Detail string `json:"detail"`
}

// CreateApp                  godoc
// @Summary                   Create a new application
// @Description               Create a new application with the given details
// @Tags                      apps
// @Accept                    json
// @Produce                   json
// @Param                     CreateAppRequest body CreateAppRequest true "Create App payload"
// @Success                   200 {object} SuccessAppCreateResponse "Example: {\"successfully\": true, \"app\": \"new_app_id\"}"
// @Failure                   400 {object} ErrorAppCreateResponse "Example: {\"error\": true, \"detail\": \"detailed error message\"}"
// @Router                    /apps/create [post]
func (h *AppHandler) CreateApp(c *gin.Context) {
	var request CreateAppRequest

	id := c.GetUint64("id")

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, ErrorAppCreateResponse{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	req := service.CreateAppRequest{
		UserId: id,
		Name:   request.Name,
		URL:    request.URL,
	}

	appId, err := h.service.CreateApp(c.Request.Context(), req)

	if err != nil {
		c.JSON(400, ErrorAppCreateResponse{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, SuccessAppCreateResponse{
		Successfully: true,
		App:          appId,
	})
}
