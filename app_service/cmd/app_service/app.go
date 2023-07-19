package main

import (
	"fmt"
	"log"
	"net"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	grpcDelivery "github.com/nik19ta/gostat/app_service/internal/app/delivery/grpc"
	"github.com/nik19ta/gostat/app_service/internal/app/model"
	"github.com/nik19ta/gostat/app_service/internal/app/repository/postgres"
	"github.com/nik19ta/gostat/app_service/internal/app/service"
	"github.com/nik19ta/gostat/app_service/pkg/env"
	pb "github.com/nik19ta/gostat/app_service/proto/app"
	"google.golang.org/grpc"
)

func main() {
	host := env.Get("DB_HOST")
	user := env.Get("DB_USER")
	dbname := env.Get("DB_NAME")
	password := env.Get("DB_PASSWORD")
	sslMode := env.Get("DB_SSLMODE")

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s password=%s sslmode=%s", host, user, dbname, password, sslMode)

	db, err := gorm.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Auto Migrate tables
	db.AutoMigrate(&model.App{})

	appRepo := postgres.NewAppRepository(db)
	appService := service.NewAppService(appRepo)
	appHandler := grpcDelivery.NewAppServiceHandler(appService)

	lis, err := net.Listen("tcp", env.Get("PORT"))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAppServiceServer(s, appHandler)

	log.Printf("Server is running on port %s", env.Get("PORT"))

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
