.PHONY: rebuild
rebuild:
	docker-compose -f docker-compose.dev.yml build --force-rm

.PHONY: db-init
db-init:
	docker-compose -f docker-compose.init-db.yml up --abort-on-container-exit

.PHONY: db-migrate
db-migrate:
	docker-compose -f docker-compose.migrate.yml up --abort-on-container-exit

.PHONY: start
start:
	docker-compose -f docker-compose.dev.yml up
