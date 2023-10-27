openapi:
	swag init --generalInfo ./cmd/server/app.go --output ./docs
	swagger2openapi ./docs/swagger.json -o ./docs/doc.json
	python3.11 ./deploy/openapi.py

build:
	make swag
	go build -o ./build/app ./cmd/server/app.go

start:
	./build/app

dev:
	make openapi
	go build -o ./build/app ./cmd/server/app.go
	./build/app

run:
	make openapi
	go run ./cmd/server/app.go
