#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$ROOT_DIR/docs"

copy_file() {
  local source_path="$1"
  local target_path="$2"

  mkdir -p "$(dirname "$target_path")"
  cp "$source_path" "$target_path"
}

copy_dir() {
  local source_path="$1"
  local target_path="$2"

  mkdir -p "$(dirname "$target_path")"
  rm -rf "$target_path"
  cp -R "$source_path" "$target_path"
}

rm -rf \
  "$DOCS_DIR/readme.md" \
  "$DOCS_DIR/README.md" \
  "$DOCS_DIR/doc.md" \
  "$DOCS_DIR/media" \
  "$DOCS_DIR/doc" \
  "$DOCS_DIR/k8s" \
  "$DOCS_DIR/frontend" \
  "$DOCS_DIR/backend"

copy_file "$ROOT_DIR/README.md" "$DOCS_DIR/doc.md"
copy_file "$ROOT_DIR/doc/diagrams/arquitectura.drawio.png" "$DOCS_DIR/doc/diagrams/arquitectura.drawio.png"
copy_dir "$ROOT_DIR/k8s" "$DOCS_DIR/k8s"
copy_file "$ROOT_DIR/frontend/package.json" "$DOCS_DIR/frontend/package.json"
copy_dir "$ROOT_DIR/frontend/tests/e2e/journeys" "$DOCS_DIR/frontend/tests/e2e/journeys"
copy_dir "$ROOT_DIR/backend/core" "$DOCS_DIR/backend/services/core"

mkdir -p "$DOCS_DIR/media"
copy_file "$ROOT_DIR/frontend/test-results/e2e-journeys-customer-purc-13f7e--cart-pays-and-checks-order-chromium/video.webm" "$DOCS_DIR/media/customer-purchase.webm"
copy_file "$ROOT_DIR/frontend/test-results/e2e-journeys-customer-purc-13f7e--cart-pays-and-checks-order-chromium/test-finished-1.png" "$DOCS_DIR/media/customer-purchase.png"
copy_file "$ROOT_DIR/frontend/test-results/e2e-journeys-admin-complet-0cbda-s-a-paid-order-as-completed-chromium/video.webm" "$DOCS_DIR/media/admin-complete-order.webm"
copy_file "$ROOT_DIR/frontend/test-results/e2e-journeys-admin-complet-0cbda-s-a-paid-order-as-completed-chromium/test-finished-1.png" "$DOCS_DIR/media/admin-complete-order.png"

echo "Docs synced into $DOCS_DIR"
