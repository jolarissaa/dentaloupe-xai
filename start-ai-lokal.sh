#!/usr/bin/env bash
# Nyalakan Dentaloupe-XAI dengan AI sungguhan di laptop ini (bukan template Vercel).
#   ML service  -> http://127.0.0.1:8000  (model gigi, pakai kartu grafis)
#   Gateway     -> http://localhost:8081  (login, upload foto, riwayat kasus)
#   Web app     -> http://localhost:3300  (buka ini di browser)
# Login: dokter@toothfairy.id / doctor123 (akun uji dari assets/seed).
# Tutup jendela ini (atau Ctrl+C) untuk mematikan semuanya.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="/c/dev/tools/node:/c/dev/tools/go/bin:$PATH"

cd "$ROOT/ml"
PYTHONUNBUFFERED=1 .venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
ML=$!

cd "$ROOT/gateway"
set -a; . ./.env; set +a
CORS_ORIGINS=http://localhost:3300 /c/dev/tools/dl-gateway.exe &
GW=$!

cd "$ROOT/web"
npx next dev -p 3300 &
WEB=$!

trap 'kill $ML $GW $WEB 2>/dev/null' EXIT
echo "Tunggu ~20 detik, lalu buka http://localhost:3300"
wait
