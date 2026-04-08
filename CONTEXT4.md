# Ghostweave Intel — Progress Log, Remaining Work & Data Pipeline Plan
# Session: 2026-04-06 — Data inspection + architecture review

---

## What's live now (v1.2 — https://luxury-biscochitos-f0197a.netlify.app)

### Completed features
| # | Feature | Notes |
|---|---------|-------|
| P1-1 | Units/Revenue toggle | `$ REV` / `# UNITS` pill in app header; re-renders Dashboard, Brands, Stores, Sales, Reps |
| P1-2 | Delist Threat section | Strategy Intel — flags SKUs where `unitsWk < listingRequirement` |
| P1-3 | Rep comparison view | Sales Reps page — rep × category chart, rep × brand chart, breakdown table |
| P1-4 | Expanded Log Sample modal | `lotNumber`, `productionDate`, `exciseStamp` (XXXX00000 format) |
| P1-5 | Listing commitment checkboxes | Log Visit — per-SKU checkboxes, saved as `listingCommitments` on visitLog |

### Tech state
- Single file: `canopycrm/index.html` — ~167KB, all data inline
- No build step. Chart.js 4.4.1 CDN + Google Fonts CDN
- localStorage for field notes only
- Deploy: drop `canopycrm/` folder into Netlify

---

## Real data — confirmed from TestData.xlsx + DumpSheet.xlsx

### TestData.xlsx
| Sheet | Rows | Purpose |
|-------|------|---------|
| PRODUCT_SOLD | 147,826 | 35 weeks of BCLDB sales (2025-06-02 → 2026-01-26). 144 unique SKUs, 525 unique addresses. |
| PRODUCT_MASTER | 145 | SKU reference: pricing, cannabinoids, terpenes, listing requirements |
| STORELIST | 716 | Address normalization lookup: ESTABLISHMENT_NAME, ADDRESS, STORE_ID, CITY |
| STORE_CLEANED | 561 | Canonical stores: store_id, id_type, establishment_name, store_name, city, territory, account_type, store_open, postal_code, store_class |

### PRODUCT_SOLD schema (raw BCLDB)
```
ESTABLISH_NAME      — store name as received (messy, needs normalization)
ADDRESS             — primary join key to STORELIST
CITY
VENDOR_NUMBER       — LP's BCLDB vendor ID (e.g. 400123 in test data)
VENDOR_NAME         — LP name
PRODUCT_SKU         — join key to PRODUCT_MASTER
INTERNAL_PRODUCT_NAME
WEED_ENDING_DATE    — Excel serial date. Convert: datetime(1899,12,30) + timedelta(days=n)
CASE_SALES          — cases sold that week
```
→ Units = CASE_SALES × PRODUCT_MASTER.UNITS_PER_CASE
→ Revenue = CASE_SALES × PRODUCT_MASTER.CASE_COST
→ Dedup key: ADDRESS + PRODUCT_SKU + WEED_ENDING_DATE (never all three legitimately duplicate)

### PRODUCT_MASTER schema
```
PRODUCT_SKU, PRODUCT_NAME, UNITS_PER_CASE, PRICE_PER_UNIT, CASE_COST,
BRAND, CATEGORY, SUB_CATEGORY, TYPE, INDIVIDUAL_WEIGHT,
TERP_SOURCE, Terpene_1, Terpene_2, Terpene_3,
THC, CBD, CBG, CBN, THCV,
Listing Requirement   ← real BCLDB thresholds (units/week total BC)
```

### Real listing requirements (confirmed from PRODUCT_MASTER — replace fakes in index.html)
| Category | Units/week |
|----------|-----------|
| Flower   | 180 |
| Pre Roll | 180 |
| IPR      | 240 |
| Vape     | 240 |
| Edible   | 300 |
| Extract  | 140 |
| Oil      | 150 |

### Real brands in test data (8 total)
- 24/7 — Flower, Pre Roll, IPR, Vape, Extract
- Chillenial — IPR, Vape, Extract
- Dāsito — Edible, Oil, Vape
- Eras — IPR, Vape
- Heavy Bags — Flower
- High-Chews — Edible
- Solenity — IPR, Vape, Extract
- Tres Commas — Flower, Vape

### STORE_CLEANED schema
```
store_id, id_type, establishment_name, store_name, city,
territory, account_type, store_open (bool), postal_code, store_class (A/B/C/D)
```
- account_type: BCCS, Independent, Key Account
- territories: Lower Mainland, Vancouver, Island, Okanagan/Interior, Kootenays, Remote
- store_class A/B/C/D → maps to app Tier 1/2/3/4

### DumpSheet.xlsx — Scott's Excel pipeline (how he currently processes data)
| Sheet | Rows | Purpose |
|-------|------|---------|
| Dump Sheet | template | Raw BCLDB paste area — Scott pastes new weekly data here |
| Cleaned | 9,107 | VLOOKUP-enriched output: Week, Month, SKU, Category, Sub Category, LP, Brand, Cases Sold, Revenue, Active SKU, Store, Store Name, Address, City, Territory Rep, Account Type, Store Open? |
| StoreMaster | 716 | STORELIST + territory/account type + monthly case counts |
| Pricing | 109 | Scott's LP's active SKU list with cost |
| Cleaned Store | 551 | Canonical stores with monthly case counts |

### How Scott's pipeline works today
1. BCLDB emails LP on Monday morning with weekly xlsx
2. Scott pastes raw data into "Dump Sheet" tab
3. "Cleaned" sheet VLOOKUPs enrich it (adds brand, category, territory, revenue, store name)
4. Scott spot-checks for new products/stores (~2 min of work)
5. Feeds cleaned data into SQL manually

---

## Architecture decision (confirmed this session)

**Stay single HTML file** until real Supabase backend is connected.

**Current architecture:**
```
browser → Netlify CDN → canopycrm/index.html (all data inline)
```

**Next step (Phase 1 — no backend needed):**
Build a Python/Node script that replicates Scott's VLOOKUP logic:
- Input: TestData.xlsx (or new weekly BCLDB file)
- Output: data.json (replaces inline JS arrays)
- The HTML fetches data.json instead of having it hardcoded
- Scott drops new xlsx → runs script → re-deploys. Zero infrastructure change.

**Phase 2 (when weekly automation is needed):**
- Same script points at Supabase (Canada Central)
- Frontend swaps `const brands = [...]` for `await supabase.from('brands').select()`
- This is also when a Vite build step makes sense (introduce alongside backend, not before)

**Critical blocker for Phase 1:**
Address normalization join: PRODUCT_SOLD.ADDRESS → STORELIST.ADDRESS → STORE_CLEANED.store_id
- 716 address variants → 561 canonical stores (~155 duplicates/variants)
- Scott's DumpSheet already handles this in VLOOKUPs — needs to be ported to code
- Fuzzy match for unknowns + manual review queue for new addresses

**Data residency:** Supabase Canada Central (non-negotiable — all stored data must be within Canada)

---

## P0 — Data accuracy fixes (do before new features)

**P0-1 — Fix listingRequirement values in skus[]**
Current inline fakes (~15/25/8) are wrong. Real values confirmed above from PRODUCT_MASTER.

**P0-2 — Fix territory names in stores[] and reps[]**
- "Metro Van" → "Lower Mainland"
- "Vancouver Island" → "Island"
- "Fraser Valley" → "Lower Mainland"
- "Okanagan" → "Okanagan/Interior"
- Add: Kootenays, Remote, Vancouver (Vancouver proper is its own territory)

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
- Sub-fields: `popUpCustomers`, `popUpStoreTraffic` (low/med/high), `popUpUnitsSold`
- Photo upload noted by Scott (P3 — needs backend)

**P2-5 — Buyback log** *(New entity + simple form)*
- New `buybacks` array: `{ id, storeId, repId, skuId, lotNumber, exciseStamp, reason, date }`
- Form modal from Samples page or store drawer

**P2-6 — Top-N store lists per brand** *(Lower priority)*
- Expand brand drawer "In Stores" section into sortable top-N table

---

## P3 — Needs backend (post-Supabase)
| Feature | Dependency |
|---------|-----------|
| Sales map by postal code | Leaflet + postal_code from STORE_CLEANED |
| Auto store classification | Real BCLDB data flowing |
| Excise stamp camera scan | Mobile PWA, camera API |
| Post-call feedback emails | Backend + email service |
| Weekly BCLDB data import | Supabase pipeline |
| Photo uploads (pop-up, buyback, merch display) | File storage (Supabase Storage) |
| Brand portal logins | Auth layer |
| Merch inventory tracker | Backend entity |
| Trellis stock data integration | API access or scraping |

---

## Async tasks for Scott (no session needed)

### High priority
- [ ] Confirm BCLDB delivery method: email attachment format? One file or multiple?
- [ ] Share Elyse's SQL scripts (for address normalization logic)
- [ ] Confirm vendor number for production LP
- [ ] Set up Supabase account: supabase.com → new project → Canada Central region → save URL + anon key

### Medium priority
- [ ] Add `launchDate` to real SKUs (needed for P2-2 pre-visit brief + P2-3 Purple Cow)
- [ ] Confirm store classifications (STORE_CLEANED store_class A/B/C/D → confirm maps to app Tier 1/2/3/4)
- [ ] Identify key accounts for extra route planner weighting
- [ ] Confirm master store group groupings for Key Account tier

---

## Schema additions still needed

```
skus:    + launchDate (ISO date) — P2-2, P2-3
         + listingRequirement (units/week) — already in fake data, needs real values from PRODUCT_MASTER

stores:  + orderDay ("Mon"|"Tue"|"Wed"|"Thu"|"Fri") — P2-1
         + managerSchedule (string[]) — P2-1
         + postalCode — from STORE_CLEANED
         + storeClass ("A"|"B"|"C"|"D") — from STORE_CLEANED
         + masterStoreGroup — key account chain grouping

visits:  + popUp (bool) — P2-4
         + popUpCustomers (number) — P2-4
         + popUpStoreTraffic ("low"|"medium"|"high") — P2-4
         + popUpUnitsSold (number) — P2-4

buybacks: new entity — id, storeId, repId, skuId, lotNumber, exciseStamp, reason, date
```

---

## Supabase tables (when ready to build)

```sql
stores        (store_id, establishment_name, store_name, city, territory,
               account_type, store_open, postal_code, store_class,
               order_day, manager_schedule, master_store_group)

products      (product_sku, product_name, brand, category, sub_category, type,
               individual_weight, units_per_case, price_per_unit, case_cost,
               listing_requirement, thc, cbd, cbg, cbn, thcv,
               terp_source, terpene_1, terpene_2, terpene_3,
               active, launch_date)

weekly_sales  (id, store_id, product_sku, week_ending, case_sales,
               units_sold, revenue, inserted_at)
               -- dedup key: (store_id + product_sku + week_ending)

visits        (id, store_id, rep_id, date, stock_days, notes,
               listing_commitments jsonb, pop_up bool,
               pop_up_customers int, pop_up_traffic text, pop_up_units_sold int)

samples       (id, sku_id, brand_id, store_id, rep_id, date_out,
               cost, revenue_gen, status, lot_number,
               production_date, excise_stamp)

buybacks      (id, store_id, rep_id, sku_id, lot_number,
               excise_stamp, reason, date)

reps          (id, name, initials, territory, store_ids[], brand_ids[])

address_map   (raw_address, store_id)
               -- normalized lookup table: replaces STORELIST vlookup chain
```

---

## Key design principles (do not change)
- Single HTML file, no build tools, opens directly in browser
- Chart.js 4.4.1 from CDN
- Google Fonts: DM Mono, Syne, Lato
- All data inline in script tag (until Supabase)
- localStorage for notes only (demo-only — do not expand)
- Drawer pattern for entity detail (slide-in from right)
- Modal pattern for forms (Log Visit, Log Sample, Add Promo)
- Toast notifications for confirmations
- Supabase Canada Central when backend is built (non-negotiable)
