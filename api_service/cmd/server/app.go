package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/nik19ta/gostat/api_service/internal/auth/delivery/http"
	"github.com/nik19ta/gostat/api_service/internal/auth/repository/grpc"
	"github.com/nik19ta/gostat/api_service/internal/auth/service"
	"github.com/nik19ta/gostat/api_service/pkg/env"
)

func main() {
	client, err := grpc.NewAuthClient(env.Get("AUTH_HOST"))
	if err != nil {
		log.Fatalf("Failed to connect to auth service: %v", err)
	}

	authService := service.NewAuthService(client)
	authHandler := http.NewAuthHandler(authService)

	router := gin.Default()

	// * Auth Router
	authRouter := router.Group("/api/auth")
	{
		authRouter.POST("/login", authHandler.Login)
		authRouter.POST("/registration", authHandler.Registration)
	}

	router.Run(env.Get("PORT"))
}
