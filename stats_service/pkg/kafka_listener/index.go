package kafka_listener

import (
	"sync"

	"github.com/IBM/sarama"
)

type KafkaListener struct {
	brokers       []string
	subscriptions map[string]func(message *sarama.ConsumerMessage)
	mu            sync.Mutex
}

func NewKafkaListener(brokers []string) *KafkaListener {
	return &KafkaListener{
		brokers:       brokers,
		subscriptions: make(map[string]func(message *sarama.ConsumerMessage)),
	}
}

func (kl *KafkaListener) Subscribe(topic string, callback func(message *sarama.ConsumerMessage)) error {
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
