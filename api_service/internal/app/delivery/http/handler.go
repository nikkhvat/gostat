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

// SuccessAppResponse struct
type SuccessAppResponse struct {
	// Indicates successful app creation
	// example: true
	Successfully bool `json:"successfully"`
	// New application ID
	// example: "new_app_id"
	App string `json:"app"`
}

// ErrorAppResp struct
type ErrorAppResp struct {
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
// @Security 									BearerAuth
// @Param                     CreateAppRequest body CreateAppRequest true "Create App payload"
// @Success                   200 {object} SuccessAppResponse "Example: {\"successfully\": true, \"app\": \"deleted_app_id\"}"
// @Failure                   400 {object} ErrorAppResp "Example: {\"error\": true, \"detail\": \"detailed error message\"}"
// @Router                    /apps/create [post]
func (h *AppHandler) CreateApp(c *gin.Context) {
	var request CreateAppRequest

	id := c.GetUint64("id")

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, ErrorAppResp{
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
		c.JSON(400, ErrorAppResp{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, SuccessAppResponse{
		Successfully: true,
		App:          appId,
	})
}

type AppRequest struct {
	ID string `uri:"id" binding:"required,uuid"`
}

// DeleteApp                  godoc
// @Summary                   Delete an application
// @Description               Delete an application based on the application ID and user ID from the bearer token
// @Tags                      apps
// @Accept                    json
// @Produce                   json
// @Security                  BearerAuth
// @Param                     id path string true "Application ID"
// @Success                   200 {object} SuccessAppResponse "Example: {\"successfully\": true, \"app\": \"app_id\"}"
// @Failure                   400 {object} ErrorAppResp "Example: {\"error\": true, \"detail\": \"detailed error message\"}"
// @Router                    /apps/{id} [delete]
func (h *AppHandler) DeleteApp(c *gin.Context) {
	id := c.GetUint64("id")

	var request AppRequest
	if err := c.ShouldBindUri(&request); err != nil {
		c.JSON(http.StatusBadRequest, ErrorAppResp{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	err := h.service.DeleteApp(c.Request.Context(), service.DeleteAppRequest{
		UserId: id,
		AppId:  request.ID,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorAppResp{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, SuccessAppResponse{
		Successfully: true,
		App:          request.ID,
	})
}
