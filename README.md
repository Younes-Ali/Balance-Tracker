# Balance Tracker - web / mobile app

The phone-friendly twin of the desktop app. Same pages (Summary, Clients, client ledger, Online Orders,
Vodafone Cash, Analytics, About), same Google Sheet, so an edit made here shows up in the desktop app
and the other way round.

- Mobile first: bottom tabs and bottom-sheet forms on a phone, sidebar layout on a PC.
- Installable: "Add to Home Screen" gives it its own icon and full-screen window (PWA).
- Works with your last saved copy when you are offline; saving is blocked until you reconnect.
- Add / edit / delete clients, record goods and payments, client photos from the camera or gallery,
  call and WhatsApp buttons, orders workflow (confirm, ship, deliver, cancel, mark paid).

## Use it without installing anything

`dist/` is a ready-made build. Upload that folder to any static host (it works from a sub-folder too):

| Host | How |
|---|---|
| Netlify | app.netlify.com/drop - drag the `dist` folder onto the page |
| Your brand website | upload `dist` into a folder such as `tracker/` -> `https://yourbrand.com/tracker/` |
| Vercel / GitHub Pages / Firebase Hosting | publish `dist` as the site root |

It must be served over **https** for "Add to Home Screen" and offline support (all hosts above do this).

First launch: enter the **API URL** (the Apps Script web app URL from `SETUP_GOOGLE_SHEETS.md`) and your
**ADMIN key**. They are stored on that device only. The shop key is refused here on purpose.

> Anyone can open the site's address, but without the admin key they see nothing. Use
> **More > Log out of this device** on any phone you do not fully control.

## Rebuild or change it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
```

Optional `.env` to pre-fill the API URL on the login screen: `VITE_SHEETS_API_URL=...`
(never put the admin key in a file that ships to the browser).

```
web/
├── public/                 manifest, service worker, icons, logo
├── shop/placeOrder.js      checkout helper for the PUBLIC shop site (uses the SHOP key only)
└── src/
    ├── api/sheetsApi.js    fetch wrapper for the Apps Script API
    ├── lib/                ledger.js (balances/statistics, same math as the desktop app),
    │                       normalize.js, orders.js, format.js, photo.js, palette.js
    ├── context/            AuthContext (session), DataContext (data + sync + all writes), ToastContext
    ├── components/
    │   ├── ui/             Button, Card, Modal (bottom sheet), Field, Badge, StatCard, Avatar...
    │   ├── layout/         AppShell, Sidebar, BottomNav, MobileTopBar, SyncStatus
    │   ├── clients/        ClientFormModal, ChargeModal, PaymentModal, TransactionRow
    │   ├── orders/         OrderCard, OrderFormModal, StatusBadge
    │   ├── vodafone/       ExpenseModal
    │   └── charts/         Recharts charts
    └── pages/              Summary, Clients, ClientDetail, Orders, Vodafone, Analytics, About, More, Login
```

## How syncing works here

- Every change is written to the sheet first; only if that succeeds does the screen update.
- While the app is open it asks for the sheet's version number every 20 seconds (only when the app is
  visible) and again whenever you come back to the tab or the phone reconnects. It downloads the data only
  if the version changed.
- Edits are per field, so changing an order's status never overwrites someone else's change to that order.
- The poll interval is `POLL_MS` in `src/context/DataContext.jsx` (the desktop app has `INTERVAL_MS` in
  `app/ui/sync.py`). Apps Script has a daily run-time quota on free Google accounts; each check is tiny, but if
  you leave several devices open all day you may want to raise these numbers.
