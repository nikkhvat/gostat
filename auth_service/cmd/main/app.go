package main

import (
	"context"
	"log"
	"net"

	pb "github.com/nik19ta/gostat/api_service/proto/auth"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedAuthServiceServer
}

func (s *server) Login(ctx context.Context, in *pb.LoginRequest) (*pb.LoginResponse, error) {
	return &pb.LoginResponse{Token: "your_jwt_token"}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAuthServiceServer(s, &server{})

	log.Println("Server is running on port 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
