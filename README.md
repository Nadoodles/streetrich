# Street Rich Fellas — landing page demo

A one-page static site in plain HTML, CSS and JS, with no build step. It uses the "After Hours" concept.

## Run it

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Swapping placeholders for real assets

| What | Where | How |
|---|---|---|
| Hero video | `assets/video/hero.mp4` | Drop the file in. It fades in over the animated scene automatically. Keep it 5–10s, muted, under ~8 MB. |
| Product photos | `assets/products/` | In `js/products.js`, set `front:` / `back:` on each product (e.g. `'assets/products/cherub-tee-back.png'`). Use transparent PNG cutouts, roughly 4:5 or square. |
| Lookbook photos | `assets/lookbook/` | In `js/products.js`, set `img:` on each look (portrait 3:4). |
| Product names, prices, sizes, sold out | `js/products.js` → `PRODUCTS` | `out: ['XL']` crosses out a size. `soldOut: true` marks the whole item sold out. |
| Next drop name, date, featured product | `js/products.js` → `DROP` | The countdown and hero pill read from here. |
| Discount codes | `js/products.js` → `CODES` | |
| Logo | `index.html` (`.nav-logo`, `.hero-logo`, `.footer-logo`) | Currently set in the Mr Dafoe font. Replace with the client's SVG wordmark. |
| Announcement bar copy | `index.html` → `.announce-track` | Both `<span>`s must match so the loop is seamless. |

## Demo-only behavior

- Checkout shows a "disabled in this demo" toast.
- The signup form doesn't send anything.
- The bag is saved in the browser (localStorage) only.
