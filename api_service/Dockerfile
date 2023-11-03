FROM golang:alpine AS builder

RUN apk update --no-cache && apk add --no-cache tzdata protobuf

WORKDIR /build
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
COPY docs .
COPY front .

RUN unset GOBIN && go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.27.1
RUN unset GOBIN && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1.0

RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/auth/service.proto
RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/stats/service.proto
RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/app/service.proto

RUN go build -ldflags="-s -w" -o /app/app cmd/server/app.go

FROM golang:1.20

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/app /app/app
COPY --from=builder /build/docs /app/docs
COPY --from=builder /build/front /app/front
COPY ./wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

CMD ["/app/wait-for-it.sh", "kafka:9092", "--", "./app"]