package main

import (
	middlewareAuth "github.com/nik19ta/gostat/api_service/middleware/auth"
	"log"

	gin "github.com/gin-gonic/gin"

	appGrpc "github.com/nik19ta/gostat/api_service/internal/app/repository/grpc"
	authGrpc "github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	statsGrpc "github.com/nik19ta/gostat/api_service/internal/stats/repository/grpc"

	appHttp "github.com/nik19ta/gostat/api_service/internal/app/delivery/http"
	authHttp "github.com/nik19ta/gostat/api_service/internal/auth/delivery/http"
	statsHttp "github.com/nik19ta/gostat/api_service/internal/stats/delivery/http"

	appService "github.com/nik19ta/gostat/api_service/internal/app/service"
	authService "github.com/nik19ta/gostat/api_service/internal/auth/service"
	statsService "github.com/nik19ta/gostat/api_service/internal/stats/service"

	middlewareCors "github.com/nik19ta/gostat/api_service/middleware/cors"
	env "github.com/nik19ta/gostat/api_service/pkg/env"
)

func main() {
	authClient, err := authGrpc.NewAuthClient(env.Get("AUTH_HOST"))

	if err != nil {
		log.Fatalf("❌ Failed to connect to auth service: %v", err)
	} else {
		log.Println("✅ Successful connect to auth service")
	}

	statsClient, err := statsGrpc.NewStatsClient(env.Get("STATS_HOST"))
	if err != nil {
		log.Fatalf("❌ Failed to connect to stats service: %v", err)
	} else {
		log.Println("✅ Successful connect to stats service")
	}

	appClient, err := appGrpc.NewAppClient(env.Get("APP_HOST"))
	if err != nil {
		log.Fatalf("❌ Failed to connect to app service: %v", err)
	} else {
		log.Println("✅ Successful connect to app service")
	}

	// Auth service
	newAuthService := authService.NewAuthService(authClient)
	authHandler := authHttp.NewAuthHandler(newAuthService)

	// Stats service
	newStatsService := statsService.NewStatsService(statsClient)
	statsHandler := statsHttp.NewStatsHandler(newStatsService)

	// Apps service
	newAppService := appService.NewAppService(appClient)
	appHandler := appHttp.NewAppHandler(newAppService)

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

		privateStatsRouter := statsRouter.Group("/get")
		privateStatsRouter.Use(middlewareAuth.AuthRequired())
		{
			privateStatsRouter.GET("/visits", statsHandler.GetVisits)
		}
	}

	// * Apps Router
	appRouter := router.Group("/api/app")
	appRouter.Use(middlewareAuth.AuthRequired())
	{
		appRouter.POST("/", appHandler.CreateApp)
	}

	router.Run(env.Get("PORT"))
}
