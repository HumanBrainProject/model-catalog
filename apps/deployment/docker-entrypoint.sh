#!/bin/sh
set -e

cat > /usr/share/nginx/html/model-catalog/env-config.js <<EOF
window.__env = { baseUrl: "${VALIDATION_SERVICE_BASE_URL:-https://model-validation-api.apps.ebrains.eu}" };
EOF

exec "$@"
