#! /bin/bash
docker network create MYNETT
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
docker system prune -f
