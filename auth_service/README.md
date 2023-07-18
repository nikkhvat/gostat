# Auth service

> This statistics microservice is written in the Golang programming language and uses the rpc protocol to interact with other services.

This microservice is responsible for authentication/registration/password recovery.

## Configuration

The statistics microservice has some configuration parameters that can be configured via environment variables or a configuration file. By default, it uses the following parameters:


```bash
JWT_SECRET="AAA" # Jwt secret

PORT=":50051" # Port

DB_HOST="db"  # for connect to the database
DB_USER="author"  # for connect to the database
DB_NAME="gostat_auth_service"  # for connect to the database
DB_PASSWORD="password"  # for connect to the database
DB_SSLMODE="disable"  # for connect to the database
```

## API

- `Login` - Log into your account

Request:

```proto
message LoginRequest {
  string login = 1;
  string password = 2;
}
```

- `Registration` - Registration new user

Request:

```proto
message RegistrationRequest {
  string login = 1;
  string mail = 2;
  string password = 3;
  string first_name = 4;
  string last_name = 5;
  string middle_name = 6;
}
```