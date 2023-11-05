package main

import (
	"log"

	middlewareAuth "github.com/nik19ta/gostat/api_service/middleware/auth"

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
	"github.com/nik19ta/gostat/api_service/pkg/kafka"
)

// @title           Gostat
// @version         1.0.0
// @description     Statistics Service - gostat. A microservice-based service, written in Golang and TypeScript.

// @contact.name   Nikita Khvatov
// @contact.url    https://khvat.pro
// @contact.email  nik19ta.me@gmail.com

// @license.name  GNU Affero General Public License v3.0
// @license.url   https://github.com/nikkhvat/gostat/blob/master/LICENSE

// @BasePath  /api
func main() {
	kafkaService, err := kafka.NewKafkaService([]string{env.Get("KAFKA_HOST")})

	if err != nil {
		log.Printf("❌ Failed to connect to kafka: %v", err)
	} else {
		log.Printf("✅ Successful connect to kafka")
	}

	authClient, err := authGrpc.NewAuthClient(env.Get("AUTH_HOST"))

	if err != nil {
		log.Fatalf("❌ Failed to connect to auth service: %v", err)
	} else {
		log.Printf("✅ Successful connect to auth service: %s", env.Get("AUTH_HOST"))
	}

	statsClient, err := statsGrpc.NewStatsClient(env.Get("STATS_HOST"))
	if err != nil {
		log.Fatalf("❌ Failed to connect to stats service: %v", err)
	} else {
		log.Printf("✅ Successful connect to stats service: %s", env.Get("STATS_HOST"))
	}

	appClient, err := appGrpc.NewAppClient(env.Get("APP_HOST"))
	if err != nil {
		log.Fatalf("❌ Failed to connect to app service: %v", err)
	} else {
		log.Printf("✅ Successful connect to app service: %s", env.Get("APP_HOST"))
	}

	defer kafkaService.Close()

	// Auth service
	newAuthService := authService.NewAuthService(authClient, appClient, kafkaService)
	authHandler := authHttp.NewAuthHandler(newAuthService)

	// Stats service
	newStatsService := statsService.NewStatsService(statsClient, kafkaService)
	statsHandler := statsHttp.NewStatsHandler(newStatsService)

	// Apps service
	newAppService := appService.NewAppService(appClient, statsClient)
	appHandler := appHttp.NewAppHandler(newAppService)

	router := gin.Default()
	router.Use(middlewareCors.CORSMiddleware())

	// * Auth Router
	authRouter := router.Group("/api/auth")
	{
		authRouter.POST("/login", authHandler.Login)
		authRouter.POST("/registration", authHandler.Registration)
		authRouter.POST("/refresh", authHandler.RefreshToken)
		authRouter.POST("/confirm", authHandler.ConfirmAccount)
		authRouter.POST("/password/request", authHandler.PasswordRequest)
		authRouter.POST("/password/reset", authHandler.PasswordReset)

		privateAuthRouter := authRouter.Group("/")
		privateAuthRouter.Use(middlewareAuth.AuthRequired())
		{
			privateAuthRouter.POST("/confirm/mail", authHandler.ConfirmSendAccount)
			privateAuthRouter.GET("/info", authHandler.GetInfoAccount)
		}
	}

	// * Stats Router
	statsRouter := router.Group("/api/stats")
	{
		publicStatsRouter := statsRouter.Group("/")
		{
			publicStatsRouter.POST("/visit/:app", statsHandler.SetVisit)
			publicStatsRouter.PATCH("/visit/:session", statsHandler.VisitExtend)
		}

		privateStatsRouter := statsRouter.Group("/")
		privateStatsRouter.Use(middlewareAuth.AuthRequired())
		{
			privateStatsRouter.GET("/visits", statsHandler.GetVisits)
		}
	}

	// * Apps Router
	appRouter := router.Group("/api/apps")
	appRouter.Use(middlewareAuth.AuthRequired())
	{
		appRouter.POST("/create", appHandler.CreateApp)
		appRouter.DELETE("/:id", appHandler.DeleteApp)
	}

	// * Docs Router
	router.Static("/docs", "./docs")
	router.Static("/api/docs", "./docs/swagger-ui-dist")

	router.Run(env.Get("PORT"))
}
