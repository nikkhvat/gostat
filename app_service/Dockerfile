# Dockerfile
FROM golang:1.20

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o ./build/app ./cmd/app_service/app.go

EXPOSE 50052

CMD ["./build/app"]
