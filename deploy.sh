#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  deploy.sh — Post-build deploy script for Next.js standalone
#  Run AFTER 'npm run build' on the production server
#  Copies all assets + creates symlinks needed at runtime
# ═══════════════════════════════════════════════════════════════
set -e

PROJECT_DIR="/var/www/nextjs"
STANDALONE="$PROJECT_DIR/.next/standalone"
PUBLIC="$PROJECT_DIR/public"

echo "=== Deploying Next.js standalone build ==="

# 1. Create symlink: .next/server_data -> /var/data
#    Maps structured_data/ and images/ for runtime access
echo "[1/7] Creating server_data symlink..."
ln -sf /var/data "$PROJECT_DIR/.next/server_data"
SYMLINK_CHECK=$(ls -la "$PROJECT_DIR/.next/server_data" 2>&1)
echo "  → $SYMLINK_CHECK"

# 2. Copy all public assets to standalone/public/
#    Required because standalone build doesn't include public/ files
echo "[2/7] Copying public assets..."
cp -f "$PUBLIC"/favicon.* "$STANDALONE/public/" 2>/dev/null && echo "  → favicons copied" || echo "  → no favicons found"
cp -rf "$PUBLIC"/brand-logos "$STANDALONE/public/" 2>/dev/null && echo "  → brand-logos copied" || echo "  → no brand-logos"
cp -rf "$PUBLIC"/images "$STANDALONE/public/" 2>/dev/null && echo "  → images copied" || echo "  → no images dir"
cp -rf "$PUBLIC"/data "$STANDALONE/public/" 2>/dev/null && echo "  → data copied" || echo "  → no data dir"

# 3. Copy environment file
echo "[3/7] Copying .env.production..."
cp -f "$PROJECT_DIR/.env.production" "$STANDALONE/"

# 4. Copy static assets for Next.js
echo "[4/7] Copying .next/static..."
cp -rf "$PROJECT_DIR/.next/static" "$STANDALONE/.next/"

# 5. Verify critical files exist
echo "[5/7] Verifying critical files..."
ERRORS=0
verify_file() {
  if [ ! -f "$1" ] && [ ! -d "$1" ]; then
    echo "  ❌ MISSING: $1"
    ERRORS=$((ERRORS+1))
  else
    echo "  ✅ $(basename "$1")"
  fi
}
verify_link() {
  if [ ! -L "$1" ] && [ ! -e "$1" ]; then
    echo "  ❌ MISSING LINK: $1"
    ERRORS=$((ERRORS+1))
  else
    echo "  ✅ $(basename "$1")"
  fi
}

verify_link "$PROJECT_DIR/.next/server_data"
verify_file "$STANDALONE/.env.production"
verify_file "$STANDALONE/server.js"
verify_file "$STANDALONE/public/favicon.svg"
verify_file "$STANDALONE/public/brand-logos"
verify_file "$STANDALONE/.next/static"

if [ $ERRORS -gt 0 ]; then
  echo "  ⚠️  $ERRORS file(s) missing — deploy may be incomplete!"
else
  echo "  ✅ All critical files present!"
fi

# 6. Restart the application
echo "[6/7] Restarting PM2..."
pm2 restart vip-nextjs

# 7. Verify the application responds
echo "[7/7] Verifying app responds..."
sleep 4
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 10 http://localhost:3000/ 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ App responding: HTTP $HTTP_CODE"
else
  echo "  ❌ App not responding: HTTP $HTTP_CODE"
  exit 1
fi

echo ""
echo "=== Deploy complete! ==="
