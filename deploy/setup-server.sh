#!/usr/bin/env bash
# One-time setup. Run ONLY on the new services instance as sudo bash setup-server.sh.
set -euo pipefail
[[ $EUID == 0 ]] || { echo 'Run with sudo.'; exit 1; }
expected='i-025aea7e0f65372f3'
token=$(curl -fsS --max-time 5 -X PUT -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' http://169.254.169.254/latest/api/token)
actual=$(curl -fsS --max-time 5 -H "X-aws-ec2-metadata-token: $token" http://169.254.169.254/latest/meta-data/instance-id)
[[ "$actual" == "$expected" ]] || { echo 'Wrong EC2 instance; nothing changed.'; exit 1; }
config='/etc/nginx/sites-available/default'
grep -Eq 'server_name[[:space:]]+services\.tivrax\.in;' "$config" || { echo 'Unexpected Nginx host; nothing changed.'; exit 1; }
if [[ -f /etc/tivrax-services-instance ]]; then
  echo 'Setup already exists. Check: systemctl status tivrax-services-sync.timer'; exit 0
fi
command -v git >/dev/null || { apt-get update; apt-get install -y git; }
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
for file in release.sh sync.sh validate.py; do [[ -f "$script_dir/$file" ]] || { echo "Missing $file; upload the whole deploy folder."; exit 1; }; done
if ! id tivrax-deploy >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /var/lib/tivrax-services --shell /bin/bash tivrax-deploy
fi
base='/var/www/tivrax'
[[ -d "$base" && ! -L "$base" && ! -e "$base/current" ]] || { echo 'Unexpected document root; stop and inspect.'; exit 1; }
install -d -o tivrax-deploy -g tivrax-deploy "$base/releases" "$base/releases/bootstrap"
find "$base" -maxdepth 1 -type f -exec cp -t "$base/releases/bootstrap" -- {} +
chown -R tivrax-deploy:tivrax-deploy "$base/releases"
chown tivrax-deploy:tivrax-deploy "$base"
ln -s "$base/releases/bootstrap" "$base/current"
backup="$config.before-services-cd-$(date -u +%Y%m%dT%H%M%S)"
cp -p "$config" "$backup"
sed -i 's|root /var/www/tivrax;|root /var/www/tivrax/current;|' "$config"
if ! grep -q 'root /var/www/tivrax/current;' "$config" || ! nginx -t; then
  cp -p "$backup" "$config"
  echo 'Config validation failed; original config restored.'; exit 1
fi
if ! systemctl reload nginx; then
  cp -p "$backup" "$config"
  nginx -t && systemctl reload nginx
  echo 'Reload failed; original config restored.'; exit 1
fi
printf '%s\n' "$expected" > /etc/tivrax-services-instance
chmod 644 /etc/tivrax-services-instance
install -d -m 755 /usr/local/libexec/tivrax-services
install -m 755 "$script_dir/release.sh" /usr/local/libexec/tivrax-services/release.sh
install -m 755 "$script_dir/sync.sh" /usr/local/libexec/tivrax-services/sync.sh
install -m 644 "$script_dir/validate.py" /usr/local/libexec/tivrax-services/validate.py
install -d -o tivrax-deploy -g tivrax-deploy /var/lib/tivrax-services
cat > /etc/systemd/system/tivrax-services-sync.service <<'UNIT'
[Unit]
Description=Update only the TivraX services static website from GitHub main
Wants=network-online.target
After=network-online.target
[Service]
Type=oneshot
User=tivrax-deploy
Group=tivrax-deploy
Environment=GIT_TERMINAL_PROMPT=0
ExecStart=/usr/local/libexec/tivrax-services/sync.sh
TimeoutStartSec=120
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/tivrax-services /var/www/tivrax
RestrictSUIDSGID=true
UNIT
cat > /etc/systemd/system/tivrax-services-sync.timer <<'UNIT'
[Unit]
Description=Check TivraX services main branch every minute
[Timer]
OnBootSec=30s
OnUnitInactiveSec=60s
AccuracySec=5s
Unit=tivrax-services-sync.service
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable --now tivrax-services-sync.timer
systemctl start tivrax-services-sync.service
echo 'Services auto-update enabled: GitHub main is checked approximately every minute.'