#!/bin/sh
# Run migrations, optional first-admin creation and seed, then exec the main command.
set -e

python manage.py migrate --noinput

if [ -n "${NT2_FIRST_ADMIN_PASSWORD}" ]; then
  python manage.py create_first_admin --username admin
fi

if [ "${SEED_INITIAL_DATA}" = "1" ]; then
  python manage.py seed_initial_data
fi

exec "$@"
