NET_COMPOSE_PATH := ./docker-compose.dev.yaml
AUTH_COMPOSE_PATH := ./authentication/docker-compose.yaml

# run, stop authentication service
auth-up:
	docker compose -f $(AUTH_COMPOSE_PATH) up -d
auth-down:
	docker compose -f $(AUTH_COMPOSE_PATH) down

