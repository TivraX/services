# Automatic updates for services.tivrax.in

Source: https://github.com/TivraX/services.git (main).
Target: ONLY EC2 i-025aea7e0f65372f3, the new services server.

## Status

Deployment scripts are prepared. Auto-update is NOT active until setup-server.sh has been run once on the new services server and its initial sync succeeds. No changes to ERP/AMS servers, their DNS, IAM roles, security groups or SSH keys are required.

## One-time activation

From local PowerShell (key stays local):

```powershell
scp -r -i "$env:USERPROFILE\Downloads\tivrax-services.pem" "F:\tivrax-website\deploy" ubuntu@13.185.26.228:~/
ssh -i "$env:USERPROFILE\Downloads\tivrax-services.pem" ubuntu@13.185.26.228
```

On the new services server:

```bash
sudo bash ~/deploy/setup-server.sh
```

The script checks the actual EC2 instance ID using IMDSv2 before making changes. It preserves the current website as a bootstrap release and the SSL configuration, validates the new document root configuration, then gracefully reloads this server's Nginx. A dedicated deployment user has no sudo privileges. Installed deployment tools are root-owned. If Nginx validation/reload fails, the original config is restored.

## How pushes go live

A systemd timer fetches the public repository's main branch approximately every 60 seconds. Only a changed commit is validated and deployed. This is automatic polling, not an instant webhook. The server needs outbound HTTPS; SSH remains limited to the administrator's IP. No GitHub Actions runner, token, paid CI service or uploaded private key is used.

Only dist assets are released. A versioned folder is staged before the current symlink is switched atomically. A local HTTPS health check checks the exact commit ID. A failed health check restores the previous release. Regular deployments do not restart Nginx. Keep write access to main limited to trusted website maintainers.

The public repository is required for this unauthenticated pull method. If it becomes private, sync fails and the current site remains live; configure a read-only deploy credential before changing visibility. Never commit keys or secrets.

## Verification

```bash
systemctl status tivrax-services-sync.timer --no-pager
sudo journalctl -u tivrax-services-sync.service -n 30 --no-pager
curl -fsS https://services.tivrax.in/.release-id
```

The release ID must equal the pushed commit. Push a small copy change, wait approximately a minute, and verify it on the live site to confirm end-to-end automation.

## Pause updates

```bash
sudo systemctl stop tivrax-services-sync.timer
```

This leaves the current website live. To resume: sudo systemctl start tivrax-services-sync.timer.

## Files and recovery

Before activation, manual SCP uploads to /var/www/tivrax/ still work. After activation, the served path is /var/www/tivrax/current/; use git pushes for routine updates. Previous releases stay under /var/www/tivrax/releases/. Monitor disk usage and retain only the releases needed for rollback. Sync errors never deliberately remove the current release.

A bootstrap release and an Nginx config backup are retained for recovery. Only switch current to a verified release directory under /var/www/tivrax/releases/. No DNS change is part of deployment or rollback.

Current server IP 13.185.26.228 is auto-assigned; stopping/starting EC2 may change it. Static IP configuration is a separate action, not performed here. This setup does not create new AWS resources; the existing EC2 continues its normal usage billing.