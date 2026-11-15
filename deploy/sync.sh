#!/usr/bin/env bash
set -euo pipefail
[[ "$(cat /etc/tivrax-services-instance)" == 'i-025aea7e0f65372f3' ]] || { echo 'Wrong server.'; exit 1; }
state='/var/lib/tivrax-services'
source="$state/source"
exec 8>"$state/.sync.lock"
flock -n 8 || exit 0
if [[ ! -d "$source/.git" ]]; then
  mkdir -p "$source"
  git init --quiet "$source"
  git -C "$source" remote add origin https://github.com/TivraX/services.git
fi
[[ "$(git -C "$source" remote get-url origin)" == 'https://github.com/TivraX/services.git' ]] || { echo 'Unexpected repository.'; exit 1; }
git -C "$source" -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=30 fetch --quiet --depth=1 origin refs/heads/main
export DEPLOY_SHA
DEPLOY_SHA=$(git -C "$source" rev-parse --verify 'FETCH_HEAD^{commit}')
if [[ -f /var/www/tivrax/current/.release-id ]] && [[ "$(cat /var/www/tivrax/current/.release-id)" == "$DEPLOY_SHA" ]]; then
  echo "Already live: $DEPLOY_SHA"; exit 0
fi
git -C "$source" -c advice.detachedHead=false checkout --quiet --force --detach "$DEPLOY_SHA"
# Use the installed validator/deployer; repository changes cannot replace these tools.
python3 /usr/local/libexec/tivrax-services/validate.py "$source/dist"
cd "$source"
bash /usr/local/libexec/tivrax-services/release.sh