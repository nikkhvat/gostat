package kafka

import (
	"encoding/json"
	"log"
	"time"

	"github.com/IBM/sarama"
	"github.com/nik19ta/gostat/stats_service/internal/stats/service"

	kafka "github.com/nik19ta/gostat/stats_service/pkg/kafka"
)

type StatsKafkaServiceHandler struct {
	service      service.StatsService
	kafkaService *kafka.KafkaService
}

func NewStatsKafkaService(s service.StatsService, kafkaService *kafka.KafkaService) *StatsKafkaServiceHandler {
	return &StatsKafkaServiceHandler{
		service:      s,
		kafkaService: kafkaService,
	}
}

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

// * add_new_visit_request
func (s *StatsKafkaServiceHandler) AddVisit(message *sarama.ConsumerMessage) error {
	var parsedMessage SetVisitRequest
	err := json.Unmarshal(message.Value, &parsedMessage)
	if err != nil {
		log.Printf("Error unmarshaling JSON in topic2: %v\n", err)
		return err
	}

	session, err := s.service.SetVisits(parsedMessage.Ip, parsedMessage.UserAgent, parsedMessage.Utm, parsedMessage.HttpReferer,
		parsedMessage.Url, parsedMessage.Title, parsedMessage.Session, parsedMessage.Unique, parsedMessage.AppId)

	if err != nil {
		log.Printf("Error add visit: %v\n", err)
		return err
	}

	err = s.kafkaService.SendMessage("add_new_visit_response", string(message.Key), SetVisitResponse{
		Session: session,
	})

	if err != nil {
		return err
	}

	return nil
}

type VisitExtend struct {
	Session string    `json:"session"`
	Time    time.Time `json:"time"`
}

// * extend_visit_request
func (s *StatsKafkaServiceHandler) ExtendVisit(message *sarama.ConsumerMessage) error {
	var parsedMessage VisitExtend
	err := json.Unmarshal(message.Value, &parsedMessage)
	if err != nil {
		log.Printf("Error unmarshaling JSON in topic2: %v\n", err)
		return err
	}

	s.service.VisitExtend(parsedMessage.Session)

	return nil
}
