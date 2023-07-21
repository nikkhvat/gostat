# App service

> This statistics microservice is written in the Golang programming language and uses the rpc protocol to interact with other services.

This microservice is responsible for managing connected applications.

## Configuration

The statistics microservice has some configuration parameters that can be configured via environment variables or a configuration file. By default, it uses the following parameters:


```bash
PORT=":50052" # Port

DB_HOST="db"  # for connect to the database
DB_USER="author"  # for connect to the database
DB_NAME="gostat_app_service"  # for connect to the database
DB_PASSWORD="password"  # for connect to the database
DB_SSLMODE="disable"  # for connect to the database

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