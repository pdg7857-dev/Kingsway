# Back up the engine database to a .sql file (run from the opportunity-engine folder).
#   .\scripts\backup.ps1
$ts = Get-Date -Format "yyyy-MM-dd_HHmm"
$out = "backup_engine_$ts.sql"
docker compose exec -T db pg_dump -U postgres engine | Out-File -Encoding utf8 $out
Write-Host "Backup written to $out"
Write-Host "Restore with: Get-Content $out | docker compose exec -T db psql -U postgres -d engine"
