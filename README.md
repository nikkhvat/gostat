# GOStat

gostat is a microservice-based application for handling HTTP requests authentication and stats. It consists of the following main microservices:

- `api_service`: This microservice is responsible for handling HTTP requests and interacting with other services.
- `auth_service`: This microservice provides authentication functionality.
- `stat_services`: This microservice provides statistics functionality.

All microservices are written in GoLang and communicate with each other using `gRPC`. They also utilize the `GORM` ORM library for interacting with a `PostgreSQL` database.

## Technologies

- Lang: `GoLang`
- Web Server: `gin`
- Database: `PostgreSQL`
- ORM: `GORM`
- interaction of microservices: `gRPC`
- `Docker` / `Docker Compose`

## Prerequisites

To run gostat locally (macos/linux), you need to have the following installed:

- PostgreSQL (version 14.8)
- Docker / Docker Compose

## Run 

- Starting the Services

```sh
make start
```

- Stopping the Services

```sh
make stop
```