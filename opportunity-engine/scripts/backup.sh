#!/usr/bin/env bash
# Back up the engine database to a .sql file (run from the opportunity-engine folder).
set -e
ts=$(date +%Y-%m-%d_%H%M)
out="backup_engine_${ts}.sql"
docker compose exec -T db pg_dump -U postgres engine > "$out"
echo "Backup written to $out"
echo "Restore with: docker compose exec -T db psql -U postgres -d engine < $out"
