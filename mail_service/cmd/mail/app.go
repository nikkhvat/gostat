package main

import (
	"log"
	"net"

	grpcDelivery "github.com/nik19ta/gostat/mail_service/internal/mail/delivery/grpc"
	"github.com/nik19ta/gostat/mail_service/internal/mail/service"
	"github.com/nik19ta/gostat/mail_service/pkg/env"
	pb "github.com/nik19ta/gostat/mail_service/proto/mail"
	"google.golang.org/grpc"
)

func main() {
	mailService := service.NewMailService()
	mailHandler := grpcDelivery.NewMailService(mailService)

	lis, err := net.Listen("tcp", env.Get("PORT"))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterMailServiceServer(s, mailHandler)

	log.Printf("Server is running on port %s", env.Get("PORT"))

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
