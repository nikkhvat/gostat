package env

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

var doOnce sync.Once

func Load() {
	doOnce.Do(func() {
		if err := godotenv.Load(); err != nil {
			log.Print("No .env file found")
		}
	})
}

func Get(key string) string {
	Load()
	return os.Getenv(key)
}
