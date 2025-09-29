#!/bin/bash
set -euxo pipefail

echo "=== Starting Prisma Migration Process ==="

echo "Generating Prisma Client..."
npx prisma generate

npx prisma migrate deploy

echo "Verifying final migration status..."
npx prisma migrate status

echo "=== Prisma Migration Process Completed ==="
