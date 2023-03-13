PROJECT = ft_transcendence

LIST_CONTAINERS := $(shell docker ps -a -q)
LIST_VOLUMES := $(shell docker volume ls -q)

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

re: reset up