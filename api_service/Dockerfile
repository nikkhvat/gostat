FROM golang:alpine AS builder

RUN apk update --no-cache && apk add --no-cache tzdata protobuf

WORKDIR /build
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN unset GOBIN && go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.27.1
RUN unset GOBIN && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1.0

RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/auth/auth.proto
RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/stats/stats.proto
RUN protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/app/app.proto

RUN go build -ldflags="-s -w" -o /app/app cmd/server/app.go

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/app /app/app

CMD ["./app"]