#!/usr/bin/env bash
# Seed agents, properties (5 images each), and news articles (3 images each).
# Run from anywhere:
#   ./scripts/populate_db.sh
#   ./scripts/populate_db.sh --clear
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/backend"
exec python3 manage.py populate_demo_data "$@"
