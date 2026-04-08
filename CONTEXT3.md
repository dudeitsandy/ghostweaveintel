# Ghostweave Intel — Progress Log, Remaining Work & Data Pipeline Plan

## What's live now (v1.2 — deployed https://luxury-biscochitos-f0197a.netlify.app)

### Completed features
| # | Feature | Notes |
|---|---------|-------|
| P1-1 | Units/Revenue toggle | `$ REV` / `# UNITS` pill in app header; re-renders Dashboard, Brands, Stores, Sales, Reps |
| P1-2 | Delist Threat section | Strategy Intel — flags SKUs where `unitsWk < listingRequirement` |
| P1-3 | Rep comparison view | Sales Reps page — rep × category chart, rep × brand chart, breakdown table |
| P1-4 | Expanded Log Sample modal | `lotNumber`, `productionDate`, `exciseStamp` (XXXX00000 format) |
| P1-5 | Listing commitment checkboxes | Log Visit — per-SKU checkboxes, saved as `listingCommitments` on visitLog |

### Tech state
- Single file: `canopycrm/index.html` — 167KB, all data inline
- No build step. Chart.js 4.4.1 CDN + Google Fonts CDN
- localStorage for field notes only
- Deploy: drop `canopycrm/` folder (the inner one containing index.html) into Netlify

---

## P0 — Data accuracy fixes (do before any new features)

These are fast corrections to the inline fake data. Wrong values make the app misleading — especially the Delist Threat section which Scott will use as a real decision tool.

**P0-1 — Fix listingRequirement values in skus[]**
Current fake values (~15/25/8) don't match real BCLDB thresholds.

| Category | Real threshold (units/week, total BC) |
|----------|---------------------------------------|
| Flower | 180 |
| Pre Roll | 180 |
| IPR (Infused Pre-Roll) | 240 |
| Vape | 240 |
| Edible | 300 |
| Extract | 140 |
| Oil | 150 |

**P0-2 — Fix territory names in stores[] and reps[]**
Current fake names → real BCLDB names:
- "Metro Van" → "Lower Mainland"
- "Vancouver Island" → "Island"
- "Fraser Valley" → "Lower Mainland" (part of same BCLDB territory)
- "Okanagan" → "Okanagan/Interior"
- Missing: Kootenays, Remote, Vancouver (Vancouver proper is its own territory)

---

## P2 — Next sprint UI features (0/6 done, recommended order)

**P2-1 — Store order day + route planner boost** *(High daily-use value)*
- Add `orderDay` (Mon–Fri) and `managerSchedule` (array of days) to store entity
- Route planner priority score += bonus if today matches `orderDay`
- Show in store drawer and Add/Edit Store form

**P2-2 — Pre-visit store brief** *(Big UX win, needs `launchDate` on skus)*
- In store drawer: ranked "Focus SKUs" section
- Tiers: new SKUs (< 4 weeks since `launchDate`), strong rate-of-sale, declining, at-risk
- Needs `launchDate` added to skus schema

**P2-3 — Purple Cow Products** *(Sales page, same `launchDate` dependency)*
- SKUs with velocity above 6-week rolling average vs lifetime average since launch
- New section on Sales & Revenue page

**P2-4 — Pop-up event log** *(Additive to Log Visit modal)*
- Toggle checkbox: "Pop-up event?"
- Sub-fields (show when checked): `popUpCustomers`, `popUpStoreTraffic` (low/med/high), `popUpUnitsSold`
- Saved on visitLog entries

**P2-5 — Buyback log** *(New entity + simple form)*
- New `buybacks` array: `{ id, storeId, repId, skuId, lotNumber, exciseStamp, reason, date }`
- Form modal from Samples page or store drawer
- Simple log table

**P2-6 — Top-N store lists per brand** *(Lower priority)*
- Expand brand drawer "In Stores" section into sortable top-N table
- Filter by revenue/units/tier

---

## P3 — Needs backend (post-Supabase)
| Feature | Dependency |
|---------|-----------|
| Sales map by postal code | Leaflet + `postal_code` from STORE_CLEANED |
| Auto store classification | Real BCLDB data flowing |
| Excise stamp camera scan | Mobile PWA, camera API |
| Post-call feedback emails | Backend + email service |
| Weekly BCLDB data import | Supabase pipeline (see below) |

---

## Recommended sequencing

### Track 1 — Claude builds (UI, no backend needed)
| Order | Task | Est. complexity |
|-------|------|-----------------|
| 1 | P0-1: Fix listingRequirement values | 10 min — find/replace in skus[] |
| 2 | P0-2: Fix territory names | 10 min — find/replace in stores[]/reps[] |
| 3 | P2-1: Store order day + route boost | 1 session |
| 4 | P2-2: Pre-visit store brief (add launchDate to skus first) | 1 session |
| 5 | P2-3: Purple Cow Products section | 30 min (shares launchDate from P2-2) |
| 6 | P2-4: Pop-up event log | 30 min (additive to existing modal) |
| 7 | P2-5: Buyback log | 1 session |
| 8 | P2-6: Top-N stores per brand | 30 min |

### Track 2 — Scott does async (no Claude needed until backend session)
See "Async tasks for Scott" section below.

### Track 3 — Backend session (Claude + Scott together)
Only start after Track 2 items are done.
1. Set up Supabase project (Canada Central)
2. Create tables from schema below
3. Build one-time import script: TestData.xlsx → Supabase
4. Replace inline JS arrays with Supabase fetch calls
5. Build weekly import endpoint (parse CSV → dedup → insert)
6. Add "Unmapped Stores" admin view for address normalization QA

---

## Async tasks for Scott (no Claude session needed)

These are things only Scott can do and that are blockers for Track 3:

### High priority (do first)
- [ ] **Confirm BCLDB delivery method**: Is the weekly data emailed as `.xlsx`, `.csv`, or another format? Does the LP get one file or multiple? This determines the parse strategy.
- [ ] **Share Elyse's VLOOKUP scripts**: If Elyse has existing Excel macros or lookup tables for the address normalization, share them — they can be ported to the pipeline directly.
- [ ] **Confirm vendor number**: What is the LP's BCLDB `VENDOR_NUMBER`? Needed to filter PRODUCT_SOLD to just your LP's rows.
- [ ] **Set up Supabase account**: Go to supabase.com → create account → new project → select Canada Central region → save the project URL and `anon` API key. (Free tier is fine to start.)

### Medium priority
- [ ] **Add `launchDate` to real SKUs**: For P2-2 (pre-visit brief) and P2-3 (Purple Cow), each SKU needs a launch date. Pull these from your LP's internal records or BCLDB listing dates.
- [ ] **Confirm brand list**: Is the fake brand list (Sequoia Reserve, Emerald Heights, etc.) close enough for demo purposes, or do you want real LP brand names in the test data now?
- [ ] **Confirm store classifications**: STORE_CLEANED has `store_class` A/B/C/D. Confirm this maps to the app's Tier 1/2/3/4 correctly (A=T1, B=T2, C=T3, D=T4).
- [ ] **Identify key accounts**: Which stores/chains should be in the "Key Account" tier? These need extra weight in the route planner.

### Lower priority
- [ ] **Canadian entity requirements**: If the app will eventually store any LP-side data (not just public BCLDB data), confirm with your LP whether there are any data residency or compliance requirements beyond "Canadian servers."
- [ ] **Note BCLDB address variants**: If you notice any store addresses in your real data that look wrong (e.g., "Main St" vs "Main Street"), flag them — they'll need to go in the normalization lookup table.

---

## Schema additions still needed (for P2)

```
skus:    + launchDate (ISO date) — P2-2 pre-visit brief, P2-3 Purple Cow

stores:  + orderDay ("Mon"|"Tue"|"Wed"|"Thu"|"Fri") — P2-1
         + managerSchedule (string[]) — P2-1
         (postal_code and store_class already in STORE_CLEANED — map at data pipeline time)

visits:  + popUp (bool) — P2-4
         + popUpCustomers (number) — P2-4
         + popUpStoreTraffic ("low"|"medium"|"high") — P2-4
         + popUpUnitsSold (number) — P2-4

buybacks: new entity — P2-5
```

---

## Real data: what we know from TestData.xlsx

### The 5 sheets
| Sheet | Rows | Purpose |
|-------|------|---------|
| PRODUCT_SOLD | 147,825 | Raw BCLDB weekly sales (35 weeks: Jun 2025–Feb 2026) |
| PRODUCT_MASTER | 145 | SKU reference — price, brand, category, listing requirements |
| STORELIST | 716 | Raw BCLDB store list (has address variants/duplicates) |
| STORE_CLEANED | 561 | Canonical store list after normalization |
| Dump Sheet | (template) | Scott's manual paste-and-vlookup staging area |

### PRODUCT_SOLD schema (raw BCLDB columns)
```
ESTABLISH_NAME     — store name as BCLDB has it (messy, not canonical)
ADDRESS            — primary join key to STORELIST/STORE_CLEANED
CITY
VENDOR_NUMBER      — LP's BCLDB vendor ID
VENDOR_NAME        — LP name
PRODUCT_SKU        — join key to PRODUCT_MASTER
INTERNAL_PRODUCT_NAME — product name
WEED_ENDING_DATE   — Excel serial date (e.g. 45810 = 2025-06-02)
                     Convert: new Date((serial - 25569) * 86400 * 1000)
CASE_SALES         — cases sold that week
```
→ **Units = CASE_SALES × PRODUCT_MASTER.UNITS_PER_CASE**
→ **Revenue = CASE_SALES × PRODUCT_MASTER.CASE_COST**

### PRODUCT_MASTER schema (enrichment layer)
```
PRODUCT_SKU, PRODUCT_NAME, UNITS_PER_CASE, PRICE_PER_UNIT, CASE_COST,
BRAND, CATEGORY, SUB_CATEGORY, TYPE, INDIVIDUAL_WEIGHT,
TERP_SOURCE, Terpene_1, Terpene_2, Terpene_3,
THC, CBD, CBG, CBN, THCV,
Listing Requirement   ← real BCLDB thresholds (units/week total BC)
```

### STORE_CLEANED schema (canonical store reference)
```
store_id, id_type, establishment_name, store_name, city,
territory, account_type, store_open (bool), postal_code, store_class
```
- **store_class:** A, B, C, D → maps to app's Tier 1, 2, 3, 4
- **territories:** Lower Mainland, Vancouver, Island, Okanagan/Interior, Kootenays, Remote
- **account_type:** BCCS, Independent, Key Account

### Key data pipeline rules (Scott confirmed)
1. **Dedup composite key:** `ADDRESS + PRODUCT_SKU + WEED_ENDING_DATE` — never all three duplicate legitimately
2. **Data is rolling 4 weeks** — each Monday drop contains current + 3 prior weeks, must dedup on insert
3. **Address join:** PRODUCT_SOLD.ADDRESS → STORELIST.ADDRESS → STORE_CLEANED (vlookup chain)
   - Addresses change spelling over time — this is why STORELIST has 716 rows for 561 canonical stores
4. **New products/stores:** must be manually checked before each import (usually ~2 min of work)
5. **Delivery:** BCLDB emails LP on Monday morning. Currently uploaded to Google Drive manually.
   - Long-term: parse email attachment directly into Supabase

---

## Data pipeline architecture (when ready to build)

```
BCLDB email (Monday)
    ↓
Parse CSV/Excel attachment
    ↓
Dedup: skip rows where (address + sku + week_ending) already in DB
    ↓
JOIN address → STORELIST → STORE_CLEANED (get store_id, territory, class)
    ↓
JOIN product_sku → PRODUCT_MASTER (get brand, category, units_per_case, case_cost, listing_req)
    ↓
Compute: units = case_sales × units_per_case
         revenue = case_sales × case_cost
    ↓
INSERT into Supabase (Canada Central region)
    ↓
App reads from Supabase instead of inline arrays
```

### Supabase tables needed
```sql
stores          (store_id, establishment_name, store_name, city, territory,
                 account_type, store_open, postal_code, store_class,
                 order_day, manager_schedule)            ← order_day = P2-1 add

products        (product_sku, product_name, brand, category, sub_category,
                 units_per_case, price_per_unit, case_cost, listing_requirement,
                 thc, cbd, terps, active, launch_date)   ← launch_date = P2-2/P2-3 add

weekly_sales    (id, store_id, product_sku, week_ending, case_sales,
                 units_sold, revenue, inserted_at)        ← dedup key: store+sku+week

visits          (id, store_id, rep_id, date, stock_days, notes,
                 listing_commitments jsonb, pop_up bool,
                 pop_up_customers int, pop_up_traffic text)

samples         (id, sku_id, brand_id, store_id, rep_id, date_out,
                 cost, revenue_gen, status, lot_number,
                 production_date, excise_stamp)

buybacks        (id, store_id, rep_id, sku_id, lot_number,
                 excise_stamp, reason, date)

reps            (id, name, initials, territory, store_ids[], brand_ids[])
```

### Address normalization (the critical blocker)
- STORELIST has 716 rows, STORE_CLEANED has 561 → ~155 duplicate/variant addresses
- Current approach: manual vlookup table Scott maintains
- For automation: fuzzy match (Levenshtein or trigram) + manual review queue for unknowns
- New addresses that don't match should surface in an admin "Unmapped Stores" list
- Scott estimates ~2 min/week of manual checking once the automation handles the known variants

### Hosting / data residency
- No customer PII in current dataset — just store addresses and wholesale sales numbers
- BCLDB data is public/industry-distributed, not customer data
- For safety: set up Supabase on Canada Central from day 1
- Frontend (Netlify): no data stored there, fine anywhere
- Scott's Google Drive files: fine for now since no customer data
