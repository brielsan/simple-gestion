#!/bin/bash
set -euxo pipefail

echo "=== Installing dependencies (prebuild) ==="
npm ci
