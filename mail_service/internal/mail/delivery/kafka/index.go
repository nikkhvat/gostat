package kafka

import (
	"encoding/json"
	"log"

	"github.com/IBM/sarama"
	"github.com/nik19ta/gostat/mail_service/internal/mail/service"
)

type MailServiceHandler struct {
	service service.MailService
}

func NewMailService(s service.MailService) *MailServiceHandler {
	return &MailServiceHandler{
		service: s,
	}
}

type SendMessageRequest struct {
	Email      string `json:"email"`
	FirstName  string `json:"first_name"`
	SecondName string `json:"second_name"`
	SecretCode string `json:"secret_code"`
}

func (h *MailServiceHandler) SendMailResetPassword(message *sarama.ConsumerMessage) error {
	var parsedMessage SendMessageRequest
	err := json.Unmarshal(message.Value, &parsedMessage)
	if err != nil {
		log.Printf("Error unmarshaling JSON in topic2: %v\n", err)
	}

	h.service.SendMailResetPassword(parsedMessage.Email, parsedMessage.FirstName, parsedMessage.SecondName, parsedMessage.SecretCode)
	return nil
}

func (h *MailServiceHandler) SendMailConfirmAccount(message *sarama.ConsumerMessage) error {
	var parsedMessage SendMessageRequest

	err := json.Unmarshal(message.Value, &parsedMessage)
	if err != nil {
		log.Printf("Error unmarshaling JSON in topic2: %v\n", err)
	}

	h.service.SendMail(parsedMessage.Email, parsedMessage.FirstName, parsedMessage.SecondName, parsedMessage.SecretCode)
	return nil
}
