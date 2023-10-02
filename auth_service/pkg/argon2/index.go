package argon2

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"log"
	"strconv"
	"strings"

	"golang.org/x/crypto/argon2"
)

func GeneratePasswordHash(password string) string {
	salt := make([]byte, 16)
	_, err := rand.Read(salt)
	if err != nil {
		panic(err)
	}

	memory := uint32(64 * 1024)
	iterations := uint32(3)
	parallelism := uint8(2)
	keyLength := uint32(32)

	key := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, keyLength)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Key := base64.RawStdEncoding.EncodeToString(key)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, memory, iterations, parallelism, b64Salt, b64Key)
}

func ComparePasswordAndHash(password, encodedHash string) bool {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		log.Println("Invalid encoded hash format")
		return false
	}

	var (
		memory      uint32
		iterations  uint32
		parallelism uint8
		err         error
	)

	params := strings.Split(parts[3], ",")
	for _, param := range params {
		keyVal := strings.Split(param, "=")
		if len(keyVal) != 2 {
			log.Println("Invalid parameter format")
			return false
		}
		switch keyVal[0] {
		case "m":
			memory64, err := strconv.ParseUint(keyVal[1], 10, 32)
			if err != nil {
				log.Println("Failed to parse memory:", err)
				return false
			}
			memory = uint32(memory64)
		case "t":
			iterations64, err := strconv.ParseUint(keyVal[1], 10, 32)
			if err != nil {
				log.Println("Failed to parse iterations:", err)
				return false
			}
			iterations = uint32(iterations64)
		case "p":
			parallelism64, err := strconv.ParseUint(keyVal[1], 10, 8)
			if err != nil {
				log.Println("Failed to parse parallelism:", err)
				return false
			}
			parallelism = uint8(parallelism64)
		default:
			log.Println("Unknown parameter")
			return false
		}
	}

	b64Salt := parts[4]
	b64Key := parts[5]

	salt, err := base64.RawStdEncoding.DecodeString(b64Salt)
	if err != nil {
		log.Println("Failed to decode salt:", err)
		return false
	}

	expectedKey, err := base64.RawStdEncoding.DecodeString(b64Key)
	if err != nil {
		log.Println("Failed to decode expectedKey:", err)
		return false
	}

	key := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, uint32(len(expectedKey)))

	match := subtle.ConstantTimeCompare(key, expectedKey) == 1
	if !match {
		log.Println("Password and hash do not match")
	}

	return match
}
