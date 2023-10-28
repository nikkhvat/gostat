package main

import (
	"log"

	"github.com/IBM/sarama"
	"github.com/nik19ta/gostat/mail_service/internal/mail/delivery/kafka"
	"github.com/nik19ta/gostat/mail_service/internal/mail/service"
	"github.com/nik19ta/gostat/mail_service/pkg/env"
	"github.com/nik19ta/gostat/mail_service/pkg/kafka_listener"
)

func main() {
	mailService := service.NewMailService()
	mailHendler := kafka.NewMailService(mailService)

	listener := kafka_listener.NewKafkaListener([]string{env.Get("KAFKA_HOST")})

	err := listener.Subscribe("confirm_account_send_mail_request", func(message *sarama.ConsumerMessage) {
		log.Println("confirm_account_send_mail_request")
		mailHendler.SendMailConfirmAccount(message)
	})

	if err != nil {
		log.Fatalf("Failed to subscribe to topic confirm_account_send_mail_request: %v", err)
	}

	err2 := listener.Subscribe("reset_password_send_mail_request", func(message *sarama.ConsumerMessage) {
		log.Println("reset_password_send_mail_request")
		mailHendler.SendMailResetPassword(message)
	})

	if err2 != nil {
		log.Fatalf("Failed to subscribe to topic reset_password_send_mail_request: %v", err)
	}

	select {}
}
