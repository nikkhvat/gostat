package main

import (
	"fmt"
	"log"
	"net"

	grpcDelivery "github.com/nik19ta/gostat/auth_service/internal/auth/delivery/grpc"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
	"github.com/nik19ta/gostat/auth_service/internal/auth/service"
	"github.com/nik19ta/gostat/auth_service/pkg/env"
	pb "github.com/nik19ta/gostat/auth_service/proto/auth"
	"google.golang.org/grpc"
	postgresDriver "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/redis/go-redis/v9"
)

func main() {
	host := env.Get("DB_HOST")
	user := env.Get("DB_USER")
	dbname := env.Get("DB_NAME")
	password := env.Get("DB_PASSWORD")
	sslmode := env.Get("DB_SSLMODE")

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s password=%s sslmode=%s", host, user, dbname, password, sslmode)

	db, err := gorm.Open(postgresDriver.New(postgresDriver.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Auto Migrate tables
	db.AutoMigrate(&model.User{})

	redisHost := env.Get("REDIS_HOST")

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Password: "",
		DB:       0,
	})

	userRepo := postgres.NewUserRepository(db, rdb)
	authService := service.NewAuthService(userRepo)
	authHandler := grpcDelivery.NewAuthServiceHandler(authService)

	lis, err := net.Listen("tcp", env.Get("PORT"))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAuthServiceServer(s, authHandler)

	log.Printf("server is running on port %s", env.Get("PORT"))

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
