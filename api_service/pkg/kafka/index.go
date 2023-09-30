package kafka

import (
	"encoding/json"

	"github.com/IBM/sarama"
)

type KafkaService struct {
	Producer sarama.SyncProducer
}

func NewKafkaService(brokers []string) (*KafkaService, error) {
	producer, err := sarama.NewSyncProducer(brokers, nil)
	if err != nil {
		return nil, err
	}

	service := &KafkaService{
		Producer: producer,
	}

	return service, nil
}

func (ks *KafkaService) SendMessage(topic string, requestID string, message interface{}) error {
	bytes, err := json.Marshal(message)
	if err != nil {
		return err
	}

	msg := &sarama.ProducerMessage{
		Topic: topic,
		Key:   sarama.StringEncoder(requestID),
		Value: sarama.ByteEncoder(bytes),
	}

	_, _, err = ks.Producer.SendMessage(msg)
	return err
}

func (ks *KafkaService) Close() error {
	return ks.Producer.Close()
}
