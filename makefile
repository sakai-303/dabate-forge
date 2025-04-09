.PHONY: start stop create-db reset-db migrate
TEST_DB_HOST := 127.0.0.1
TEST_DB_PORT := 3306

start:
	docker compose up -d
	@make wait-db

wait-db:
	@echo "Waiting for MySQL to become available..."
	@until mysqladmin ping -h $(TEST_DB_HOST) -P $(TEST_DB_PORT) --silent;do sleep 1;done
	@echo "MySQL is ready."
