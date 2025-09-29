#!/bin/bash
set -euxo pipefail

echo "Zipping the project..."

zip -r ./app.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x ".cursor/*" \
  -x ".env" \
  -x "*.md" \
  -x "node_modules/*" \
  -x "deploy/*" \
  -x "prisma/generated/*" \

echo "Zipped the project successfully!"