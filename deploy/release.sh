#!/usr/bin/env bash
set -euo pipefail
expected_instance='i-025aea7e0f65372f3'
[[ "$(cat /etc/tivrax-services-instance)" == "$expected_instance" ]] || { echo 'Wrong server; refusing deployment.'; exit 1; }
: "${DEPLOY_SHA:?Set the verified services commit SHA}"
[[ "$DEPLOY_SHA" =~ ^[a-f0-9]{40}$ ]] || exit 1
base='/var/www/tivrax'
[[ -L "$base/current" ]] || { echo 'Run setup-server.sh once before deploying.'; exit 1; }
exec 9>"$base/.deploy.lock"
flock -w 120 9
release="$base/releases/$(date -u +%Y%m%dT%H%M%S)-$DEPLOY_SHA"
previous=$(readlink -f "$base/current")
mkdir "$release"
cp -R dist/. "$release/"
printf '%s\n' "$DEPLOY_SHA" > "$release/.release-id"
chmod -R a+rX "$release"
next="$base/current.next.$$"
trap 'rm -f "$next"' EXIT
ln -s "$release" "$next"
mv -Tf "$next" "$base/current"
if ! actual=$(curl --fail --silent --show-error --retry 2 --max-time 15 --resolve services.tivrax.in:443:127.0.0.1 https://services.tivrax.in/.release-id) || [[ "$actual" != "$DEPLOY_SHA" ]]; then
  ln -s "$previous" "$next"
  mv -Tf "$next" "$base/current"
  echo 'Health check failed; previous release restored.'
  exit 1
fi
printf 'Deployed %s to https://services.tivrax.in\n' "$DEPLOY_SHA"