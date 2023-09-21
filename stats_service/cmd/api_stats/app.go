package main

import (
	"fmt"
	"log"
	"net"

	grpcDelivery "github.com/nik19ta/gostat/stats_service/internal/stats/delivery/grpc"
	"github.com/nik19ta/gostat/stats_service/internal/stats/model"
	"github.com/nik19ta/gostat/stats_service/internal/stats/repository/postgres"
	"github.com/nik19ta/gostat/stats_service/internal/stats/service"
	"github.com/nik19ta/gostat/stats_service/pkg/env"
	pb "github.com/nik19ta/gostat/stats_service/proto/stats"
	grpc "google.golang.org/grpc"
	postgresDriver "gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	host := env.Get("DB_HOST")
	user := env.Get("DB_USER")
	dbname := env.Get("DB_NAME")
	password := env.Get("DB_PASSWORD")
	sslMode := env.Get("DB_SSLMODE")

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s password=%s sslmode=%s", host, user, dbname, password, sslMode)

	db, err := gorm.Open(postgresDriver.New(postgresDriver.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto Migrate tables
	db.AutoMigrate(&model.Visits{})

	statsRepo := postgres.NewStatsRepository(db)
	statsService := service.NewStatsService(statsRepo)
	statsHandler := grpcDelivery.NewAuthServiceHandler(statsService)

	lis, err := net.Listen("tcp", env.Get("PORT"))

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterStatsServiceServer(s, statsHandler)

	log.Printf("Server is running on port %s", env.Get("PORT"))

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
