# App service

> This statistics microservice is written in the Golang programming language and uses the rpc protocol to interact with other services.

This microservice serves as an API interface. It handles HTTP requests, filters them, and forwards the requests to microservices via gRPC.

## Configuration

The statistics microservice has some configuration parameters that can be configured via environment variables or a configuration file. By default, it uses the following parameters:


```bash
PORT=":8080" # Http port

JWT_SECRET="" # Jwt secret ( for auth middleware )

AUTH_HOST="auth_service:50051" # Host AUTH microservice
STATS_HOST="stats_service:50050" # Host STATS microservice
APP_HOST="app_service:50052" # Host APP microservice

GIN_MODE=release # gin mode
```

## API

- `CreateApp` - Create new application

Request:

```proto
message CreateAppRequest {
  string name = 1;
  string url = 2;
  uint64 user_id = 3;
}
```

- `GetApp` - Get application

Request:

```proto
message GetAppRequest {
  string id = 1;
  string user_id = 2;
}
```

- `GetAppsByUserId` - Get applications by user id

Request:

```proto
message GetAppsByUserIdRequest {
  string user_id = 1;
}
```