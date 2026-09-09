#!/usr/bin/env bash
set -euo pipefail
# Local-clone entry point. Uses the same implementation as npx.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22 or newer is required. Alternatively run npx ai-governance-setup." >&2
  exit 1
fi
exec node "$SCRIPT_DIR/bin/cli.js" "$@"
