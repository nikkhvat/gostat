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

type VisitData struct {
	Pathname   string    `json:"pathname"`
	Host       string    `json:"host"`
	Hash       string    `json:"hash"`
	Title      string    `json:"title"`
	Expired    bool      `json:"expired"`
	Resolution string    `json:"resolution"`
	UTM        UTMParams `json:"utm"`
}

type UTMParams struct {
	Source   string `json:"utm_source,omitempty"`
	Medium   string `json:"utm_medium,omitempty"`
	Campaign string `json:"utm_campaign,omitempty"`
	Term     string `json:"utm_term,omitempty"`
	Content  string `json:"utm_content,omitempty"`
}

// SetVisit godoc
// @Summary Register a new visit or extend an existing session
// @Description Endpoint for registering a new visit or extending an existing session.
// @Tags stats
// @Accept json
// @Produce json
// @Param app path string true "Application ID"
// @Param body body VisitData true "Visit Details"
// @Success 200 {object} SuccessSetVisitResponse
// @Failure 400 {object} ErrorSetVisitResponse
// @Router /stats/set/visit/{app} [post]
func (h *StatsHandler) SetVisit(c *gin.Context) {
	app := c.Param("app")

	var data VisitData
	if err := c.BindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to bind JSON"})
		return
	}

	if app == "" {
		c.JSON(http.StatusBadRequest, ErrorSetVisitResponse{
			Error:  true,
			Detail: "app id cannot be empty",
		})
		return
	}

	unique := data.Expired == false

	userAgent := c.Request.Header.Get("User-Agent")

	session, err := h.service.AddVisit(c.Request.Context(), service.AddVisitRequest{
		UserAgent:  userAgent,
		IP:         c.ClientIP(),
		App:        app,
		Pathname:   data.Pathname,
		Host:       data.Hash,
		Hash:       data.Hash,
		Title:      data.Title,
		Unique:     unique,
		Resolution: data.Resolution,
		Source:     data.UTM.Source,
		Medium:     data.UTM.Medium,
		Campaign:   data.UTM.Campaign,
		Term:       data.UTM.Term,
		Content:    data.UTM.Content,
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
		Session:      *session,
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

// VisitExtend godoc
// @Summary Extend the visit session duration
// @Description Endpoint to extend the duration of an active visit session.
// @Tags stats
// @Accept json
// @Produce json
// @Param session path string true "Session ID"
// @Success 200 {object} SuccessVisitExtendResponse
// @Failure 400 {object} ErrorVisitExtendResponse
// @Router /api/stats/visit/{session} [patch]
func (h *StatsHandler) VisitExtend(c *gin.Context) {
	session := c.Param("session")

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
// @Security                   BearerAuth
// @Param                      app query string true "Application ID"
// @Success                    200 {object} interface{} "Successfully retrieved data. The structure of the data depends on the application."
// @Failure                    400 {object} ErrorGetVisitResponse "Example: {\"error\": true, \"detail\": \"Detailed error message\"}"
// @Router                     /stats/get/visits [get]
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
