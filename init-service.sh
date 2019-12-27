#!/bin/bash
set -euo pipefail

until PGPASSWORD="${HZ_CARAVEL_POSTGRES_PASSWORD}" psql -d "${HZ_CARAVEL_POSTGRES_DATABASE}" -h "${HZ_CARAVEL_POSTGRES_HOST}" -U "${HZ_CARAVEL_POSTGRES_USER}" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

 # export database url env for the migration to target the right database host and port
export DATABASE_URL=postgres://$HZ_CARAVEL_POSTGRES_USER:$HZ_CARAVEL_POSTGRES_PASSWORD@$HZ_CARAVEL_POSTGRES_HOST:5432/$HZ_CARAVEL_POSTGRES_DATABASE

# mandatory database migration (need docker database to be healthy)
# see @https://github.com/salsita/node-pg-migrate
node-pg-migrate up

# launch micro-service
node index.js
