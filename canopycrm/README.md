# Canopy CRM — MVP Demo

BC Cannabis Sales Intelligence Platform

## Deploy to Netlify (2 minutes)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire `canopycrm/` folder onto the Netlify deploy dropzone
3. Done — live URL generated instantly, no build step needed

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --dir . --prod
```

## Project Structure

```
canopycrm/
├── index.html        ← Entire app (single file, no build needed)
└── netlify.toml      ← Routing config
```

## Swapping in Real Data

All fake data lives in the `<script type="module">` block inside `index.html`, starting with the `// ── DATA` section. When Scott provides his SQL export:

1. Export tables as JSON (brands, stores, reps, skus, samples, weekly_revenue)
2. Replace the corresponding arrays in the DATA section
3. Re-deploy to Netlify

### Expected data shape

**brands**: id, name, category, province, repId, skus, activeStores, status, logoInitials, color, revenue30d, units30d, revenuePrev, rank

**stores**: id, name, chain, city, region, rep (repId), brandIds[], skusInStock, lastVisit, status, revenue30d, units30d, tier (A/B/C)

**reps**: id, name, initials, territory, storeIds[], brandIds[], revenue30d, units30d, visits30d, samplesOut

**skus**: id, brandId, name, category, price, unitsWk, trend (%), storeCount, xrCode

**samples**: id, skuId, brandId, storeId, repId, xrCode, dateOut, value, status (reordered|pending|expired|not_converted)

**weeklyRevenue**: week (label), total, per-brand columns

## Pages

| Page | What it shows |
|---|---|
| Dashboard | KPI summary, revenue trend chart, top stores, rep leaderboard |
| Brands | All brands ranked by revenue, filter by category, click for full drawer detail |
| Stores | All retail locations, filter by region, click for full drawer detail |
| Sales Reps | Territory cards with stores, brands, revenue per rep |
| Sales & Revenue | SKU velocity ranking with XR codes, trend, store count |
| Distribution | Brand × store coverage matrix — OOS flagged in red |
| Samples | Full sample log: XR code tracking, conversion status, ROV |

## Phase 2 ideas (post-MVP)

- Mobile scan-to-log for sample tracking (XR/barcode camera input)
- Web scraper integration for live store inventory
- Email/Slack alerts for OOS conditions
- PostgreSQL backend + auth layer
- Per-brand revenue dashboards for brand partner logins
