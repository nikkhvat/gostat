package http

import (
	"log"
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

func (h *StatsHandler) SetVisit(c *gin.Context) {
	un := c.DefaultQuery("un", "0")
	utm := c.DefaultQuery("utm", "")
	url := c.DefaultQuery("url", "/")
	title := c.DefaultQuery("title", "untitled")
	session := c.DefaultQuery("session", "")
	appId := c.DefaultQuery("app_id", "")

	if appId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "app id cannot be empty"})
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
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(200, gin.H{"session": session})
}

func (h *StatsHandler) VisitExtend(c *gin.Context) {
	session := c.DefaultQuery("session", "")

	err := h.service.VisitExtend(c.Request.Context(), service.VisitExtendRequest{
		Session: session,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "successfully"})
}

func (h StatsHandler) GetVisits(c *gin.Context) {
	app := c.DefaultQuery("app", "")

	if app == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "app cannot be empty"})
		return
	}

	log.Println(app)

	data, err := h.service.GetVisits(c.Request.Context(), service.GetVisitRequest{
		AppId: app,
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": data})
}
