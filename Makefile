# * Proto Generation
# services with proto
SERVICES := api_service auth_service stats_service app_service mail_service
# all proto dirs
PROTO_DIRS := auth stats app mail

delete_proto_files:
	for svc in $(SERVICES); do \
		rm -rf $$svc/proto; \
	done

copy_proto_files:
	make delete_proto_files
	for svc in $(SERVICES); do \
		cp -r ./proto $$svc/proto; \
	done

generate_proto_services:
	for svc in $(filter-out api_service,$(SERVICES)); do \
		mkdir -p $$svc/proto; \
		proto_dir=$$(echo $$svc | sed -e 's/_service//'); \
		protoc --go_out=$$svc --go_opt=paths=source_relative --go-grpc_out=$$svc --go-grpc_opt=paths=source_relative proto/$$proto_dir/service.proto; \
	done

generate_proto_api_service:
	mkdir -p api_service/proto; \
	for proto_dir in $(PROTO_DIRS); do \
		protoc --go_out=./api_service --go_opt=paths=source_relative --go-grpc_out=./api_service --go-grpc_opt=paths=source_relative proto/$$proto_dir/service.proto; \
	done

generate_proto: delete_proto_files generate_proto_services generate_proto_api_service

# * Docker
DOCKER_SERVICES := api_service auth_service stats_service app_service mail_service db

define stop_service
	@docker-compose stop $(1)
	@docker-compose rm -f $(1)
endef

define start_service
	@docker-compose up --build -d $(1)
endef

stop_%:
	$(call stop_service,$*)

start_%:
	$(call start_service,$*)

stop: 
	docker-compose --env-file ./config/.env.prod down

start:
	@if [ -f ./.env ]; then \
		ENV_FILE="./.env"; \
	else \
		ENV_FILE="./config/.env.prod"; \
	fi; \
	make delete_proto_files; \
	make copy_proto_files; \
	docker-compose --env-file $$ENV_FILE up --build -d

start_live:
	@if [ -f ./.env ]; then \
		ENV_FILE="./.env"; \
	else \
		ENV_FILE="./config/.env.prod"; \
	fi; \
	make delete_proto_files; \
	make copy_proto_files; \
	docker-compose --env-file $$ENV_FILE up --build

dev:
	make delete_proto_files
	make copy_proto_files
	docker-compose --env-file ./config/.env.dev up --build -d