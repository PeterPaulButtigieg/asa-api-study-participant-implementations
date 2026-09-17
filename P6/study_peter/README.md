# Rushed Svelte Shop

Minimal SvelteKit frontend for the supplied Study Checkout API.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## API

The project uses the supplied `src/lib/api.js` unchanged.
It currently points to:

`http://192.168.1.165:8000`

The backend must be running and reachable at that address. If the study API is hosted at a different address, change only `API_BASE_URL` in `src/lib/api.js`.

## Pages

- `/` products list
- `/product/[id]` product detail and quantity
- `/checkout?product=[id]&qty=[quantity]` checkout
- `/order/[id]` successful order confirmation
