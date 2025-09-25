#!/bin/bash
set -euxo pipefail

echo "Running Prisma migrate deploy..."

node node_modules/prisma/build/index.js migrate deploy

echo "Prisma migrate deploy completed."
