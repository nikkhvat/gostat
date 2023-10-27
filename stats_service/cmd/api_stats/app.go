package main

import (
	"fmt"
	"log"
	"net"

	"github.com/IBM/sarama"
	grpcDelivery "github.com/nik19ta/gostat/stats_service/internal/stats/delivery/grpc"
	kafkaStatService "github.com/nik19ta/gostat/stats_service/internal/stats/delivery/kafka"
	"github.com/nik19ta/gostat/stats_service/internal/stats/model"
	"github.com/nik19ta/gostat/stats_service/internal/stats/repository/postgres"
	"github.com/nik19ta/gostat/stats_service/internal/stats/service"
	"github.com/nik19ta/gostat/stats_service/pkg/env"
	kafka "github.com/nik19ta/gostat/stats_service/pkg/kafka"
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
	statsHandler := grpcDelivery.NewStatsServiceHandler(statsService)

	lis, err := net.Listen("tcp", env.Get("PORT"))

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterStatsServiceServer(s, statsHandler)

	log.Printf("Server is running on port %s", env.Get("PORT"))

	kafkaService, err := kafka.NewKafkaService([]string{env.Get("KAFKA_HOST")})

	if err != nil {
		log.Panicln(err)
	}

	mailService := service.NewStatsService(statsRepo)
	mailHendler := kafkaStatService.NewStatsKafkaService(mailService, kafkaService)

	listenerError := kafkaService.Subscribe("add_new_visit_request", func(message *sarama.ConsumerMessage) {
		mailHendler.AddVisit(message)
	})

	listenerError = kafkaService.Subscribe("extend_visit_request", func(message *sarama.ConsumerMessage) {
		mailHendler.ExtendVisit(message)
	})

	if listenerError != nil {
		log.Fatalf("Failed to subscribe to kafka topic: %v", err)
	}

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
