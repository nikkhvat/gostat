delete_proto:
	rm -rf api_service/proto
	rm -rf auth_service/proto

generate_proto_api_service:
	mkdir api_service/proto
	protoc --go_out=./api_service --go_opt=paths=source_relative --go-grpc_out=./api_service --go-grpc_opt=paths=source_relative proto/auth/auth.proto

generate_proto_auth_service:
	mkdir auth_service/proto
	protoc --go_out=./auth_service --go_opt=paths=source_relative --go-grpc_out=./auth_service --go-grpc_opt=paths=source_relative proto/auth/auth.proto

start_auth_service:

generate_proto:
	make delete_proto

	make generate_proto_api_service
	make generate_proto_auth_service