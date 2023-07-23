delete_proto_files:
	rm -rf api_service/proto
	rm -rf auth_service/proto
	rm -rf stats_service/proto
	rm -rf app_service/proto

copy_proto_files:
	cp -r ./proto ./api_service/proto
	cp -r ./proto ./auth_service/proto
	cp -r ./proto ./stats_service/proto
	cp -r ./proto ./app_service/proto

generate_proto_api_service:
	mkdir api_service/proto
	protoc --go_out=./api_service --go_opt=paths=source_relative --go-grpc_out=./api_service --go-grpc_opt=paths=source_relative proto/auth/auth.proto
	protoc --go_out=./api_service --go_opt=paths=source_relative --go-grpc_out=./api_service --go-grpc_opt=paths=source_relative proto/stats/stats.proto
	protoc --go_out=./api_service --go_opt=paths=source_relative --go-grpc_out=./api_service --go-grpc_opt=paths=source_relative proto/app/app.proto

generate_proto_auth_service:
	mkdir auth_service/proto
	protoc --go_out=./auth_service --go_opt=paths=source_relative --go-grpc_out=./auth_service --go-grpc_opt=paths=source_relative proto/auth/auth.proto

generate_proto_stats_service:
	mkdir stats_service/proto
	protoc --go_out=./stats_service --go_opt=paths=source_relative --go-grpc_out=./stats_service --go-grpc_opt=paths=source_relative proto/stats/stats.proto

generate_proto_app_service:
	mkdir app_service/proto
	protoc --go_out=./app_service --go_opt=paths=source_relative --go-grpc_out=./app_service --go-grpc_opt=paths=source_relative proto/app/app.proto

generate_proto:
	make delete_proto_files

	make generate_proto_api_service
	make generate_proto_auth_service
	make generate_proto_stats_service
	make generate_proto_app_service

stop_api_service:
	docker-compose stop api_service
	docker-compose rm -f api_service

stop_auth_service:
	docker-compose stop auth_service
	docker-compose rm -f auth_service

stop_stats_service:
	docker-compose stop stats_service
	docker-compose rm -f stats_service

stop_app_service:
	docker-compose stop app_service
	docker-compose rm -f app_service

stop_db:
	docker-compose stop db
	docker-compose rm -f db

stop:
	make stop_api_service
	make stop_auth_service
	make stop_stats_service
	make stop_app_service
	make stop_db

start:
	make delete_proto_files
	make copy_proto_files
	
	docker-compose up --build -d

start_with_out_backgroud:
	make delete_proto_files
	make copy_proto_files

	docker-compose up --build
