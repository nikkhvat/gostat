CREATE ROLE author WITH LOGIN PASSWORD 'password';

CREATE DATABASE gostat_stats_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE gostat_stats_service TO author;

CREATE DATABASE gostat_auth_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE gostat_auth_service TO author;

CREATE DATABASE gostat_app_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE gostat_app_service TO author;
