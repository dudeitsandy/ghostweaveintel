# Ghostweave Intel — Session Context

## What this project is
Cannabis sales CRM for BC market. Single HTML file (index.html), no build step,
deploys to Netlify. Client is Scott Renouf — sales rep managing brands across BC
retail cannabis stores. Data comes from BCLDB (BC Liquor Distribution Branch)
weekly wholesale reports.

## Current state
v1.1 is live at: https://luxury-biscochitos-f0197a.netlify.app
Single file: canopycrm/index.html
All data is inline JS arrays — fake but realistic BC cannabis data.
12 pages built: Dashboard, Strategy Intel, Route Planner, Brands, Stores,
Contacts, Sales Reps, Sales & Revenue, Samples & ROV, Distribution, Shelf Share,
Promo Calendar.

## What Scott sent us (his test data)
Google Drive: https://docs.google.com/spreadsheets/d/17LHL5dn7iuStZ9PTSIAyomuIyAPk7mCT/
4 sheets:
- Product Sold: 8 months BCLDB weekly sales data, deduped. Headers match BCLDB format exactly.
- Product Master: SKU list with categories, pricing, cannabinoid/terpene data,
  and a "listing requirement" column (minimum weekly units to maintain BCLDB listing — critical).
- Store List: ~750 raw BCLDB address variants that map to ~550 actual stores.
  This is the address normalization lookup table.
- Store Cleaned: canonical store names, territory IDs, store types,
  postal codes, classifications.

## Priority features Scott asked for (from his email)

### P1 — Do these first
1. Units/Revenue toggle — global switch across all views (Dashboard, Brands,
   Stores, Sales). Scott explicitly asked for this.
2. Delist Threat module — SKUs selling below their "listing requirement" threshold
   get flagged. Add to Strategy Intel as a new alert section.
3. Rep comparison view — rep × brand and rep × category breakdowns. Side-by-side.
   New page or expansion of Strategy Intel.
4. Expanded sample schema — add: lot_number, production_date, excise_stamp
   (format: 4 letters + 5 digits, e.g. BCAB12345) to the Log Sample modal and
   samples data array.
5. Listing commitment field — add to Log Visit modal: per product discussed,
   a checkbox "store committed to stocking this."

### P2 — Next sprint
6. Pre-visit store brief — in the store drawer, a ranked SKU focus list:
   new SKUs (< 4 weeks old) → most recently ordered → best rate-of-sale →
   declining → dropped (store stopped ordering).
7. Store order day field — add order_day (Mon–Fri) and manager_schedule to
   Store entity. Route planner should boost score if today matches order day.
8. Purple Cow Products — SKUs that have sold consistently well. Metric:
   6-week rolling average vs. lifetime average since launch. Add to Sales page.
9. Buyback log — new form: store, product, lot #, excise #, reason. Simple.
10. Pop-up event log — add to visit log: pop-up flag, approx customers spoken
    with, store traffic estimate, units sold during pop-up for brand.
11. Top-N store lists per brand/rep — filterable, sortable table on Brands page.

### P3 — Future
- Sales map by postal code (Leaflet + geocoding)
- Auto store classification by purchase behavior (ML)
- Excise stamp camera scan (mobile PWA)
- Post-call feedback emails
- Weekly BCLDB data import pipeline with address normalization

## Key data facts
- ~750 BCLDB address variants → ~550 actual stores
- Address normalization is THE critical dependency — nothing else works without it
- Product Sold may match to Product Master by a unique ID or by name (unconfirmed)
- Excise stamps: province color-coded, 9-char code (4 letters + 5 numbers)
- All stored data must be in Canada (non-negotiable — use Supabase Canada Central
  region when backend is built)
- localStorage for notes is demo-only. Server sync needed before production use.

## Current data schema (inline in index.html)
brands: id, name, category, province, repId, skus, activeStores, status,
        logo, color, revenue30d, units30d, revenuePrev, rank
stores: id, name, chain, city, region, rep, brandIds[], skus, lastVisit,
        status, revenue30d, units30d, tier, stockDays, pendingSamples
reps:   id, name, initials, territory, storeIds[], brandIds[],
        revenue30d, units30d, visits30d, samplesOut
skus:   id, brandId, name, category, price, unitsWk, trend, storeCount
samples: id, skuId, brandId, storeId, repId, dateOut, cost, revenueGen, status
promos: id, name, brandId, type, storeIds[], start, end, budget,
        expectedLift, actualLift, status

## What needs to be added to data schema
skus:    + listingRequirement (units/week from Product Master)
         + launchDate (for Purple Cow and launch tracker)
stores:  + orderDay (Mon/Tue/Wed/Thu/Fri)
         + managerSchedule (array of days manager is in)
         + postalCode
         + classification (Scott's LP-specific store classification)
         + masterStoreGroup (chain-level key account grouping)
samples: + lotNumber
         + productionDate
         + exciseStamp (9-char, format XXXX00000)
visits:  + listingCommitments ([{skuId, committed: bool}])
         + popUp (bool)
         + popUpCustomers (number)
         + popUpStoreTraffic (low/medium/high)
         + popUpUnitsSold (number)
buybacks: new entity — id, storeId, repId, skuId, lotNumber, exciseStamp,
          reason, date

## Tech constraints
- Single HTML file. No build tools. No npm in the browser.
- Chart.js 4.4.1 from CDN
- Google Fonts: DM Mono, Syne, Lato
- localStorage for notes only
- Drawer pattern for entity detail
- Modal pattern for forms (Log Visit, Log Sample, Add Promo)
- Toast notifications for confirmations