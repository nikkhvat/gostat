package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/stats/service"
)

type StatsHandler struct {
	service *service.StatsService
}

func NewStatsHandler(service *service.StatsService) *StatsHandler {
	return &StatsHandler{service: service}
}

// ErrorSetVisitResponse struct
type ErrorSetVisitResponse struct {
	// Indicates an error occurred
	// example: true
	Error bool `json:"error"`
	// Detailed error message
	// example: "Detailed error message"
	Detail string `json:"detail"`
}

// SuccessSetVisitResponse struct
type SuccessSetVisitResponse struct {
	// Indicates successful visit setting or extending
	// example: true
	Successfully bool `json:"successfully"`
	// Session ID for the visit
	// example: "session_id"
	Session string `json:"session"`
}

// SetVisit                      godoc
// @Summary                      Set a new visit session
// @Description                  Registers a new visit or extends an existing session
// @Tags                         stats
// @Accept                       json
// @Produce                      json
// @Param                        un query string false "Unique (1 or 0)"
// @Param                        utm query string false "UTM parameters"
// @Param                        url query string false "Visited URL"
// @Param                        title query string false "Page Title"
// @Param                        session query string false "Session ID"
// @Param                        app_id query string true "Application ID"
// @Success                      200 {object} SuccessSetVisitResponse "Example: {\"successfully\": true, \"session\": \"session_id\"}"
// @Failure                      400 {object} ErrorSetVisitResponse "Example: {\"error\": true, \"detail\": \"Detailed error message\"}"
// @Router                       /api/stats/set/visit [put]
func (h *StatsHandler) SetVisit(c *gin.Context) {
	un := c.DefaultQuery("un", "0")
	utm := c.DefaultQuery("utm", "")
	url := c.DefaultQuery("url", "/")
	title := c.DefaultQuery("title", "untitled")
	session := c.DefaultQuery("session", "")
	appId := c.DefaultQuery("app_id", "")

	if appId == "" {
		c.JSON(http.StatusBadRequest, ErrorSetVisitResponse{
			Error:  true,
			Detail: "app id cannot be empty",
		})
	}

	unique := un == "1"

	httpReferer := c.Request.Header.Get("Referer")
	userAgent := c.Request.Header.Get("User-Agent")

	session, err := h.service.AddVisit(c.Request.Context(), service.AddVisitRequest{
		IP:          c.ClientIP(),
		UserAgent:   userAgent,
		UTM:         utm,
		HTTPReferer: httpReferer,
		URL:         url,
		Title:       title,
		Session:     session,
		Unique:      unique,
		AppId:       appId,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorSetVisitResponse{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, SuccessSetVisitResponse{
		Successfully: true,
		Session:      session,
	})
}

// SuccessVisitExtendResponse struct
type SuccessVisitExtendResponse struct {
	// Indicates successful visit extension
	// example: true
	Successfully bool `json:"successfully"`
}

// ErrorVisitExtendResponse struct
type ErrorVisitExtendResponse struct {
	// Indicates an error occurred
	// example: true
	Error bool `json:"error"`
	// Detailed error message
	// example: "Detailed error message"
	Detail string `json:"detail"`
}

// VisitExtend                 godoc
// @Summary                    Extend a visit session
// @Description                Extends the session for a particular visit
// @Tags                       stats
// @Accept                     json
// @Produce                    json
// @Param                      session query string false "Visit Session ID"
// @Success                    200 {object} SuccessVisitExtendResponse "Example: {\"successfully\": true}"
// @Failure                    400 {object} ErrorVisitExtendResponse "Example: {\"error\": true, \"detail\": \"Detailed error message\"}"
// @Router                     /api/stats/set/visit/extend [put]
func (h *StatsHandler) VisitExtend(c *gin.Context) {
	session := c.DefaultQuery("session", "")

	err := h.service.VisitExtend(c.Request.Context(), service.VisitExtendRequest{
		Session: session,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorVisitExtendResponse{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, SuccessVisitExtendResponse{
		Successfully: true,
	})
}

// ErrorGetVisitResponse struct
type ErrorGetVisitResponse struct {
	// Indicates an error occurred
	// example: true
	Error bool `json:"error"`
	// Detailed error message
	// example: "Detailed error message"
	Detail string `json:"detail"`
}

// GetVisits                   godoc
// @Summary                    Retrieve visits for an application
// @Description                Retrieves visits data for a specific application
// @Tags                       stats
// @Accept                     json
// @Produce                    json
// @Param                      app query string true "Application ID"
// @Success                    200 {object} interface{} "Successfully retrieved data. The structure of the data depends on the application."
// @Failure                    400 {object} ErrorGetVisitResponse "Example: {\"error\": true, \"detail\": \"Detailed error message\"}"
// @Router                     /api/stats/get/visits [get]
func (h StatsHandler) GetVisits(c *gin.Context) {
	app := c.DefaultQuery("app", "")

	if app == "" {
		c.JSON(http.StatusBadRequest, ErrorGetVisitResponse{
			Error:  true,
			Detail: "app cannot be empty",
		})
		return
	}

	data, err := h.service.GetVisits(c.Request.Context(), service.GetVisitRequest{
		AppId: app,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorGetVisitResponse{
			Error:  true,
			Detail: err.Error(),
		})
		return
	}

	c.JSON(200, data)
}
