# TivraX website

Responsive marketing website implemented from the supplied `Home3.dc.html` company reference. Separate from the existing ERP application. No build step or dependencies are required.

## Preview

Run `node server.mjs` from this directory and visit http://localhost:4173.

## Files

- `dist/index.html`: page structure and company copy.
- `dist/styles.css`: navy, orange and cream design; responsive mobile layout.
- `dist/app.js`: sample trip animation, comparison tabs, own/market workflow, rescue dialog, demo draft download, real opt-in browser geolocation.
- `dist/config.js`: contact configuration. Replace null contact values after company approval. Draft forms do not submit to a backend, regardless of `previewMode`; a tested intake integration is required for live bookings.

## Pending company inputs

Rescue phone, WhatsApp, demo email, operating hours, confirmed coverage, AMS price, FMS price, bundle price, rate-control scope, privacy/terms text, and production request intake. Placeholder numbers never initiate real calls. Unconfirmed reference prices are shown as quote/early access rather than published as confirmed amounts.

Personal details remain in page memory and user-initiated JSON downloads. There is no localStorage, fake OTP, fake ticket, fake successful dispatch, or simulated GPS position. Reloading discards entered details.
