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
	UserAgent  string `json:"user_agent"`
	IP         string `json:"ip"`
	App        string `json:"app,omitempty"`
	Pathname   string `json:"pathname"`
	Host       string `json:"host"`
	Hash       string `json:"hash"`
	Title      string `json:"title"`
	Resolution string `json:"resolution"`
	Source     string `json:"utm_source,omitempty"`
	Medium     string `json:"utm_medium,omitempty"`
	Campaign   string `json:"utm_campaign,omitempty"`
	Term       string `json:"utm_term,omitempty"`
	Content    string `json:"utm_content,omitempty"`
	Unique     bool   `json:"unique"`
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

	session, err := s.service.SetVisits(
		parsedMessage.UserAgent,
		parsedMessage.IP,
		parsedMessage.App,
		parsedMessage.Pathname,
		parsedMessage.Host,
		parsedMessage.Hash,
		parsedMessage.Title,
		parsedMessage.Resolution,
		parsedMessage.Source,
		parsedMessage.Medium,
		parsedMessage.Campaign,
		parsedMessage.Term,
		parsedMessage.Content,
		parsedMessage.Unique,
	)

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
