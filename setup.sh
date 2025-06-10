#!/usr/bin/env sh

echo ""
echo "> Copying example environment files..."
cp ./server/.env.example ./server/.env
cp ./client/.env.example ./client/.env
echo ""
echo "> Building the Docker images..."
docker compose -f compose.yml build
echo ""
echo "> Seeding the database..."
docker compose -f compose.yml run -it --rm server python manage.py migrate --noinput
docker compose -f compose.yml run -it --rm server python manage.py seed_db
echo ""
echo "> Creating a superuser..."
docker compose -f compose.yml run -it --rm server python manage.py createsuperuser