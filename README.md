# TivraX services website

Responsive static company website based on the supplied Home3.dc.html reference. Separate from the ERP application. No build step or npm dependencies.

## Local preview

Run node server.mjs and open http://localhost:4173.

## Production

https://services.tivrax.in runs on its own EC2 instance. Source repository: https://github.com/TivraX/services.git.

## Languages

The header selector supports Hinglish (default), English and Hindi. Selection persists in localStorage. Language switching translates page copy, dynamic comparison/workflow content, rescue forms and accessible labels while preserving entered form values. Translation copy is maintained in dist/i18n.js. No external translation API is used.

## Contact and requests

Footer, call and WhatsApp use +91 8887815793. Contact configuration is in dist/config.js. WhatsApp opens a prefilled message in the selected language; the visitor presses Send. Rescue service choices open WhatsApp directly with the selected service and prompts for customer details. No rescue inputs or geolocation are collected on this website. The demo form still prepares a downloadable draft; no automatic dispatch is connected. Personal form details are kept in page memory and user-initiated downloads, not localStorage.

Company confirmation is still needed for operating hours, service coverage, pricing, rate-control scope and legal copy.

## Git push deployment

See deploy/README.md. Scripts are ready for a services-only systemd timer that checks GitHub main approximately every minute and deploys new commits with atomic release switching and health-check rollback. The one-time server setup and first successful sync must be completed before automatic updates are active. No GitHub Actions runner or SSH key upload is required.

## Validation

node --check dist/app.js
node --check dist/i18n.js
python deploy/validate.py

Browser QA covers all three languages, phone/tablet/desktop layouts, form flows, language persistence and preserved input state. The deployment scripts have shell syntax checks; live timer activation still requires server verification.