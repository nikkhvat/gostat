swag:
	swag init --generalInfo ./cmd/server/app.go --output ./docs

build:
	make swag
	go build -o ./build/app ./cmd/server/app.go

start:
	./build/app

dev:
	make swag
	go build -o ./build/app ./cmd/server/app.go
	./build/app

run:
	make swag
	go run ./cmd/server/app.go
