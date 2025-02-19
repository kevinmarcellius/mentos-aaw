AUTH_COMPOSE_PATH := ./authentication/docker-compose.yaml
TENANT_COMPOSE_PATH := ./tenant/docker-compose.yaml

# run, stop authentication service
auth-up:
	docker compose -f $(AUTH_COMPOSE_PATH) up -d
auth-down:
	docker compose -f $(AUTH_COMPOSE_PATH) down

# run, stop tenant service
tenant-up:
	docker compose -f $(TENANT_COMPOSE_PATH) up -d
tenant-down:
	docker compose -f $(TENANT_COMPOSE_PATH) down

