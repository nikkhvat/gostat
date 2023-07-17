# Dockerfile
FROM golang:1.20

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o ./build/app ./cmd/api_stats/app.go 

EXPOSE 50050

CMD ["./build/app"]
