package kafka

import (
	"encoding/json"
	"errors"
	"sync"
	"time"

	"github.com/IBM/sarama"
)

type KafkaService struct {
	brokers       []string
	Producer      sarama.SyncProducer
	mu            sync.Mutex
	chans         map[string]chan string
	subscriptions map[string]func(message *sarama.ConsumerMessage)
}

func NewKafkaService(brokers []string) (*KafkaService, error) {
	producer, err := sarama.NewSyncProducer(brokers, nil)
	if err != nil {
		return nil, err
	}

	service := &KafkaService{
		Producer:      producer,
		chans:         make(map[string]chan string),
		brokers:       brokers,
		subscriptions: make(map[string]func(message *sarama.ConsumerMessage)),
	}

	return service, nil
}

func (kl *KafkaService) Subscribe(topic string, callback func(message *sarama.ConsumerMessage)) error {
	kl.mu.Lock()
	defer kl.mu.Unlock()

	if _, exists := kl.subscriptions[topic]; exists {
		return nil // Already subscribed
	}

	consumer, err := sarama.NewConsumer(kl.brokers, nil)
	if err != nil {
		return err
	}

	partitionConsumer, err := consumer.ConsumePartition(topic, 0, sarama.OffsetNewest)
	if err != nil {
		return err
	}

	kl.subscriptions[topic] = callback

	go func() {
		defer consumer.Close()
		defer partitionConsumer.Close()

		for message := range partitionConsumer.Messages() {
			kl.mu.Lock()
			if cb, exists := kl.subscriptions[topic]; exists {
				cb(message)
			}
			kl.mu.Unlock()
		}
	}()

	return nil
}

func (rw *KafkaService) Wait(responseTopic, requestID string) (string, error) {
	ch := make(chan string, 1)

	rw.mu.Lock()
	rw.chans[requestID] = ch
	rw.mu.Unlock()

	defer func() {
		rw.mu.Lock()
		delete(rw.chans, requestID)
		rw.mu.Unlock()
	}()

	select {
	case response := <-ch:
		return response, nil
	case <-time.After(30 * time.Second): // Adjust the timeout as needed
		return "", errors.New("timeout waiting for response")
	}
}

func (rw *KafkaService) Notify(requestID, response string) {
	rw.mu.Lock()
	ch, ok := rw.chans[requestID]
	rw.mu.Unlock()

	if ok {
		ch <- response
	}
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
