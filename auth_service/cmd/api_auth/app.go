package main

import (
	"log"
	"net"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	grpcDelivery "github.com/nik19ta/gostat/auth_service/internal/auth/delivery/grpc"
	"github.com/nik19ta/gostat/auth_service/internal/auth/model"
	"github.com/nik19ta/gostat/auth_service/internal/auth/repository/postgres"
	"github.com/nik19ta/gostat/auth_service/internal/auth/service"
	pb "github.com/nik19ta/gostat/auth_service/proto/auth"
	"google.golang.org/grpc"
)

func main() {
	db, err := gorm.Open("postgres", "host=localhost user=author dbname=gostat password=123456789 sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Auto Migrate tables
	db.AutoMigrate(&model.User{})

	userRepo := postgres.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	authHandler := grpcDelivery.NewAuthServiceHandler(authService)

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAuthServiceServer(s, authHandler)

	log.Println("Server is running on port 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
