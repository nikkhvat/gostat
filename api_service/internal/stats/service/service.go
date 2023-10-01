package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/IBM/sarama"
	"github.com/nik19ta/gostat/api_service/internal/stats/repository/grpc"
	"github.com/nik19ta/gostat/api_service/pkg/kafka"
	"github.com/nik19ta/gostat/api_service/proto/stats"
)

type StatsService struct {
	client       *grpc.StatsClient
	kafkaService *kafka.KafkaService
}

func NewStatsService(client *grpc.StatsClient, kafkaService *kafka.KafkaService) *StatsService {
	service := &StatsService{
		client:       client,
		kafkaService: kafkaService,
	}

	kafkaService.Subscribe("add_new_visit_response", func(message *sarama.ConsumerMessage) {
		var parsedMessage SetVisitResponse
		err := json.Unmarshal(message.Value, &parsedMessage)
		if err != nil {
			log.Printf("Error unmarshaling JSON in topic2: %v\n", err)
			return
		}

		log.Println("=============kafkaService==============")
		log.Println(parsedMessage)
		log.Println(string(message.Key))
		log.Println("=============kafkaService==============")
		kafkaService.Notify(string(message.Key), parsedMessage.Session)
	})

	return service
}

type AddVisitRequest struct {
	IP          string `json:"ip"`
	UserAgent   string `json:"user_agent"`
	UTM         string `json:"utm"`
	HTTPReferer string `json:"httpReferer"`
	URL         string `json:"url"`
	Title       string `json:"title"`
	Session     string `json:"session"`
	Unique      bool   `json:"unique"`
	AppId       string `json:"appId"`
}

type GetVisitRequest struct {
	AppId string `json:"app_id"`
}

//

type SetVisitRequest struct {
	Ip          string `json:"ip"`
	UserAgent   string `json:"user_agent"`
	Utm         string `json:"utm"`
	HttpReferer string `json:"http_referer"`
	Url         string `json:"url"`
	Title       string `json:"title"`
	Session     string `json:"session"`
	Unique      bool   `json:"unique"`
	AppId       string `json:"app_id"`
}

type SetVisitResponse struct {
	Session string `json:"session"`
}

func (s *StatsService) AddVisit(ctx context.Context, req AddVisitRequest) (string, error) {

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	err := s.kafkaService.SendMessage("add_new_visit_request", requestID, SetVisitRequest{
		Ip:          req.IP,
		UserAgent:   req.UserAgent,
		Utm:         req.UTM,
		HttpReferer: req.HTTPReferer,
		Url:         req.URL,
		Title:       req.Title,
		Session:     req.Session,
		Unique:      req.Unique,
		AppId:       req.AppId,
	})

	if err != nil {
		return "", err
	}

	log.Println("------------requestID-------------")
	log.Println(requestID)
	log.Println("------------requestID-------------")

	session, err := s.kafkaService.Wait("add_new_visit_response", requestID)

	if err != nil {
		return "", err
	}

	return session, nil
}

type VisitExtendRequest struct {
	Session string `json:"session"`
}

type VisitExtend struct {
	Session string    `json:"session"`
	Time    time.Time `json:"time"`
}

func (s *StatsService) VisitExtend(ctx context.Context, req VisitExtendRequest) error {

	requestID := fmt.Sprintf("%d", time.Now().UnixNano())

	err := s.kafkaService.SendMessage("extend_visit_request", requestID, VisitExtend{
		Session: req.Session,
		Time:    time.Now(),
	})

	return err
}

func (s *StatsService) GetVisits(ctx context.Context, req GetVisitRequest) (interface{}, error) {
	data, err := s.client.GetVisits(ctx, &stats.GetVisitsRequest{
		AppId: req.AppId,
	})

	return data, err
}
