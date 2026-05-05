# BillboardWeb

Turn any desktop monitor into a cinematic scrolling billboard. Built to be filmed.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs to dist/
npm run preview      # serves dist/ locally
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new, import the repo. Vercel auto-detects Vite — no config needed.
3. The `vercel.json` in the root rewrites all paths to `index.html` so share-link `#hash` URLs work on direct navigation.
4. Deploy. You'll get a `https://*.vercel.app` URL immediately. Add a custom domain in **Project Settings → Domains** when ready.

No environment variables. No backend. Static build only.

## Going live with paid products (Lemon Squeezy)

Edit `src/data/products.ts` and replace each `REPLACE-WITH-…-VARIANT-UUID` placeholder with the real LS "Buy now" URL.

For each product:

1. Sign in at lemonsqueezy.com.
2. Create a Store, then a Product.
3. Set price (`$7` for watermark removal, `$9` for Cyberpunk pack).
4. **Enable License keys** in product settings (key delivery happens via the receipt email).
5. Copy the variant's "Buy now" URL into `src/data/products.ts`.

Validation runs entirely in-browser via the LS license API — no backend, no webhook, no env vars. Customers paste the key from their receipt into the activation form in the editor.

## Adding a new preset pack

1. Create `src/data/<pack-name>.ts` exporting a `PresetPack` (see `cyberpunk.ts` for shape). Set `productId` to a unique id.
2. Add the productId to `ProductId` in `src/data/products.ts` and add a `PRODUCTS[<id>]` entry with checkout URL + price.
3. Add the productId to `readInitialLicenses` in `src/state/useBillboardStore.ts`.
4. Append the pack to `PRESET_PACKS` in `src/data/presets.ts`.

A locked-pack card and license-key flow appear automatically.
