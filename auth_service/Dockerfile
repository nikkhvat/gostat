# Dockerfile
FROM golang:1.20

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o ./build/app ./cmd/api_auth/app.go 

EXPOSE 50051

CMD ["./build/app"]
