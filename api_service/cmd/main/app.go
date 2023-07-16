package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	pb "github.com/nik19ta/gostat/api_service/proto/auth"
	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	clientAuth := pb.NewAuthServiceClient(conn)

	r := gin.Default()

	r.POST("/api/auth/login", func(c *gin.Context) {
		var loginData struct {
			Login    string `json:"login"`
			Password string `json:"password"`
		}
		if err := c.BindJSON(&loginData); err != nil {
			return
		}

		res, err := clientAuth.Login(context.Background(), &pb.LoginRequest{
			Login:    loginData.Login,
			Password: loginData.Password,
		})

		if err != nil {
			log.Fatalf("could not authenticate: %v", err)
		}

		c.JSON(200, gin.H{"token": res.GetToken()})
	})

	r.Run(":8080")
}
