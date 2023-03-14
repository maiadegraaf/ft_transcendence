PROJECT = ft_transcendence

LIST_CONTAINERS := $(shell docker ps -a -q)
LIST_VOLUMES := $(shell docker volume ls -q)

SG_PATH := $(addprefix /sgoingfre/, $(USER)/)

all: up

up:
	docker-compose -f src/docker-compose.yml up --build

stop:
	docker-compose -f src/docker-compose.yml stop

kill:
	docker-compose -f src/docker-compose.yml kill

reset:
	docker-compose -f src/docker-compose.yml down
	docker rm -f $(LIST_CONTAINERS)
	docker volume rm -f $(LIST_VOLUMES)
	rm -rf $(DB_PATH)/db_data
	
prune: 
	docker system prune -af --volumes	
	# rm -rf $(SG_PATH)/db_data

purge: kill prune reset

re: reset up

echo:
	@echo $(LIST_CONTAINERS)
	@echo $(LIST_VOLUMES)
	@echo $(DB_PATH)