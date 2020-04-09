#!/bin/bash
set -euo pipefail

until PGPASSWORD="${JAKKADI_POSTGRES_PASSWORD}" psql -d "${JAKKADI_POSTGRES_DATABASE}" -h "${JAKKADI_POSTGRES_HOST}" -U "${JAKKADI_POSTGRES_USER}" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

 # export database url env for the migration to target the right database host and port
export DATABASE_URL=postgres://$JAKKADI_POSTGRES_USER:$JAKKADI_POSTGRES_PASSWORD@$JAKKADI_POSTGRES_HOST:5432/$JAKKADI_POSTGRES_DATABASE

# mandatory database migration (need docker database to be healthy)
# see @https://github.com/salsita/node-pg-migrate
node-pg-migrate up

# launch micro-service
node index.js
