#!/bin/bash
set -euxo pipefail

SWAPFILE="/var/swapfile"
SWAPSIZE_MB=1024

already_active() {
  swapon --show | grep -q "$SWAPFILE"
}

if ! already_active; then
  if command -v fallocate >/dev/null 2>&1; then
    fallocate -l "${SWAPSIZE_MB}M" "$SWAPFILE"
  else
    dd if=/dev/zero of="$SWAPFILE" bs=1M count="$SWAPSIZE_MB"
  fi

  chmod 600 "$SWAPFILE"
  mkswap "$SWAPFILE"
  swapon "$SWAPFILE"

  sysctl -w vm.swappiness=60
  sysctl -w vm.vfs_cache_pressure=50
else
  echo "Swap ya activo en $SWAPFILE"
fi

echo "Swap listo:"
swapon --show || true
free -h || true
