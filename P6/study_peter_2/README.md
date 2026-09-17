# 2 Things Store - accessibility-enabled rebuild

Run:

```bash
npm install
npm run dev
```

The dev server listens on port 5173 and on the local network.
The API URL is currently hard-coded in `src/lib/api.js` as `http://192.168.1.165:8000`.

The API helper sends `Accessibility: true` on every request and keeps the full API error body on `error.data`, with HTTP status on `error.status`.
