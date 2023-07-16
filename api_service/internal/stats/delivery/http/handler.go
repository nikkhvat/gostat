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

func (h *StatsHandler) SetVisit(c *gin.Context) {
	un := c.DefaultQuery("un", "0")
	utm := c.DefaultQuery("utm", "")
	url := c.DefaultQuery("url", "/")
	title := c.DefaultQuery("title", "untitled")
	session := c.DefaultQuery("session", "")

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
