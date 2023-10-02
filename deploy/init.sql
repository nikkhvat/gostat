CREATE ROLE author WITH LOGIN PASSWORD 'password';

CREATE DATABASE stats_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE stats_service TO author;

CREATE DATABASE auth_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE auth_service TO author;

CREATE DATABASE app_service WITH OWNER = author;
GRANT ALL PRIVILEGES ON DATABASE app_service TO author;