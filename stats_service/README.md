# Stat Service

> This statistics microservice is written in the Golang programming language and uses the rpc protocol to interact with other services.

This microservice is responsible for handling statistics.

## Configuration

The statistics microservice has some configuration parameters that can be configured via environment variables or a configuration file. By default, it uses the following parameters:


```bash
PORT=":50050" # the port on which the microservice will listen for gRPC requests

DB_HOST="db" # for connect to the database
DB_USER="author" # for connect to the database
DB_NAME="gostat_stats_service" # for connect to the database
DB_PASSWORD="password" # for connect to the database
DB_SSLMODE="disable" # for connect to the database

IP_DATABASE_PATH="../IP_DATABASE" - Database of IP addresses
```

## API

- `SetVisit` - record a visit on the site

Request:

```proto
message SetVisitRequest {
  string ip = 1;
  string user_agent = 2;
  string utm = 3;
  string http_referer = 4;
  string url = 5;
  string title = 6;
  string session = 7;
  bool unique = 8;
  string app_id = 9;
}
```

- `VisitExtend` -extend the session of visiting the site

Request:

```proto
message VisitExtendRequest {
  string session = 1;
}
```

- `GetVisits` - get statistics for the month

Request:

```proto
message GetVisitsRequest {
  string app_id = 1;
}
```