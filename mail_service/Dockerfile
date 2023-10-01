FROM golang:alpine AS builder

RUN apk update --no-cache && apk add --no-cache tzdata protobuf

WORKDIR /build

ADD go.mod .
ADD go.sum .
RUN go mod download
COPY . .

RUN go build -ldflags="-s -w" -o /app/app cmd/mail/app.go

FROM golang:1.20

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/app /app/app
COPY ./wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

CMD ["/app/wait-for-it.sh", "kafka:9092", "--", "./app"]
