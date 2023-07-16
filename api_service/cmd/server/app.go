package main

import (
	"log"

	gin "github.com/gin-gonic/gin"

	authGrpc "github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	statsGrpc "github.com/nik19ta/gostat/api_service/internal/stats/repository/grpc"

	authHttp "github.com/nik19ta/gostat/api_service/internal/auth/delivery/http"
	statsHttp "github.com/nik19ta/gostat/api_service/internal/stats/delivery/http"

	authService "github.com/nik19ta/gostat/api_service/internal/auth/service"
	statsService "github.com/nik19ta/gostat/api_service/internal/stats/service"

	middlewareAuth "github.com/nik19ta/gostat/api_service/middleware/auth"
	middlewareCors "github.com/nik19ta/gostat/api_service/middleware/cors"
	env "github.com/nik19ta/gostat/api_service/pkg/env"
)

func main() {
	authClient, err := authGrpc.NewAuthClient(env.Get("AUTH_HOST"))
	if err != nil {
		log.Fatalf("Failed to connect to auth service: %v", err)
	}

	statsClient, err := statsGrpc.NewStatsClient(env.Get("STATS_HOST"))
	if err != nil {
		log.Fatalf("Failed to connect to auth service: %v", err)
	}

	authService := authService.NewAuthService(authClient)
	authHandler := authHttp.NewAuthHandler(authService)

	statsService := statsService.NewStatsService(statsClient)
	statsHandler := statsHttp.NewStatsHandler(statsService)

	router := gin.Default()
	router.Use(middlewareCors.CORSMiddleware())

	// * Auth Router
	authRouter := router.Group("/api/auth")
	{
		authRouter.POST("/login", authHandler.Login)
		authRouter.POST("/registration", authHandler.Registration)
	}

	// * Stats Router
	statsRouter := router.Group("/api/stats")
	{
		publicStatsRouter := statsRouter.Group("/set")
		{
			publicStatsRouter.PUT("/visit", statsHandler.SetVisit)
			publicStatsRouter.PUT("/visit/extend", statsHandler.VisitExtend)
		}

		// privateStatsRouter := statsRouter.Group("/get")
		// privateStatsRouter.Use(middlewareAuth.AuthRequired())
		// {
		// 	privateStatsRouter.GET("/visits", h.GetVisits)
		// 	privateStatsRouter.GET("/links", h.GetLinks)
		// }
	}

	privateRouter := router.Group("/api")
	privateRouter.Use(middlewareAuth.AuthRequired())
	{
		privateRouter.GET("/test", func(c *gin.Context) {
			c.JSON(200, gin.H{"test": "ok"})
		})
	}

	router.Run(env.Get("PORT"))
}
