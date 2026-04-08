# Ghostweave Intel CRM — Build Context

    ## Project Location
    `C:\Users\subfl\workspace\CanopyCRM\canopycrm\index.html`

    All app code is a **single self-contained HTML file** (no build step, no npm).
    Data file at `src/data/index.js` is NOT used — data is inline in `index.html`.
    Logo: `ghostweave_logo.png` exists in the `canopycrm/` directory.

    ---

    ## Rebrand
    - **From**: Canopy CRM
    - **To**: Ghostweave Intel
    - Title: `Ghostweave Intel — BC Cannabis Intelligence`
    - Logo: use `<img src="ghostweave_logo.png">` in header with SVG fallback
    - Header badge: `BC · v2.0`
    - Sidebar footer: `v2.0 · Ghostweave Intel`

    ---

    ## Current App Structure (existing pages)
    1. Dashboard
    2. Route Planner
    3. Brands (8 brands)
    4. Stores (12 stores)
    5. Contacts (24 contacts)
    6. Sales Reps (3 reps)
    7. Sales & Revenue
    8. Samples & ROV
    9. Distribution Matrix
    10. Shelf Share
    11. Promo Calendar

    ---

    ## New Features to Add

    ### 1. Tooltip System
    - Single `<div id="gw-tip">` fixed element, JS-driven
    - Add `data-tip="..."` attribute to any element
    - JS: mouseover finds closest `[data-tip]`, positions tooltip near cursor
    - Apply to:
      - Tier pills: `data-tip="Tier A — Top tier: 30d rev > $25K. Priority visits, full SKU push."`
      - Tier B: `data-tip="Tier B — Mid tier: $12K–$25K. Standard cadence, growth opportunity."`
      - Tier C: `data-tip="Tier C — Emerging: < $12K. Monitor; consider dev support or de-list."`
      - Priority score circles: `data-tip="Score = (Days Since Visit × 2) + (10 − Stock Days) + (Pending Samples × 5) +
    Tier Weight (A=10, B=5, C=2)"`
      - ROV values: `data-tip="ROV = Revenue generated per $1 of sample cost. Target: 5x+. Excellent: 10x+."`
      - Trend arrows: contextual up/down/flat explanations
      - Sample status pills: explain each status

    ### 2. Notes / Annotations System
    - localStorage key: `ghostweave_notes`
    - Functions: `getNotes()`, `saveNote(key, val)`, `getNote(key)`
    - Note keys: `note_store_s1`, `note_brand_b1`, `note_contact_c1`
    - Every drawer gets a **Field Notes** section at the bottom:
      - `<textarea class="note-area">` pre-filled from localStorage
      - "Save Note" button + "Saved ✓" confirmation
    - Track `currentDrawerKey` variable so save knows which entity

    ### 3. New Page: Strategy Intel
    **Nav position**: First item under Overview (above or alongside Dashboard)
    **Nav icon**: lightning bolt or brain

    **Page sections**:

    #### A. Metrics Row (4 cards)
    - Revenue vs Target (total 30d rev vs sum of store targets)
    - Sample Pipeline Value (pending samples × avg ROV × cost)
    - Urgent Visit Alerts (stores with priority score ≥ 30)
    - Q2 Revenue Forecast (projected from trend)

    #### B. Priority Actions (left column)
    Programmatically generated ranked action cards with colored top border:
    - `critical` (red) — urgent visits (score ≥ 30)
    - `high` (amber) — pending samples > 14 days old
    - `med` (blue) — OOS gaps at top stores for top brands
    Each card shows: type icon, title, detail line, estimated impact in $

    #### C. Revenue Forecast Chart (right column)
    Line chart combining:
    - Actual weekly revenue (solid green line, 8 weeks)
    - Forecast weeks (dashed, lighter green, 4 weeks: Mar 24, Mar 31, Apr 7, Apr 14)
    - Seamless join at last actual point

    Forecast values: `74900, 77800, 80600, 83400`

    #### D. Recent Field Activity Feed (right column, below forecast)
    Scrollable list of recent rep activities with dot indicator

    #### E. Brand Health Scorecard
    Grid of brand cards, each with:
    - Brand avatar + name
    - Composite health score (0–100) with color bar
    - Score breakdown: Revenue Trend, Velocity, Coverage, Sample ROV

    Health score formula:
    revTrendScore = 50 + ((rev30d - revPrev) / revPrev) * 200  (clamped 0-100)
    velScore = 50 + (avg SKU trend) * 2  (clamped 0-100)
    coverageScore = (activeStores / totalStores) * 100
    rovScore = min(100, (sampleRev / sampleCost) * 10)
    healthScore = round(revTrendScore0.35 + velScore0.25 + coverageScore0.25 + rovScore0.15)

    #### F. Stock Risk Table
    Stores with stockDays ≤ 3, showing:
    - Store name, region, stock days (red pill), revenue/day, at-risk revenue, action button

    ---

    ## Data Additions

    ### Activities Array (new)
    ```js
    const activities = [
      {rep:'r1', type:'visit', entity:'Sessions Cannabis Robson', date:'2026-03-18', note:'Restocked Broken Coast &
    Jeeter. New facing secured.'},
      {rep:'r2', type:'sample', entity:'Canna Cabana Hastings', date:'2026-03-14', note:'Dropped Jeeter Baby Jeeter 5pk.
     Buyer very interested.'},
      {rep:'r1', type:'visit', entity:'Canna Cabana Victoria', date:'2026-03-14', note:'Raj confirmed exclusive Spring
    promo for Grön.'},
      {rep:'r2', type:'visit', entity:'Tokyo Smoke Gastown', date:'2026-03-16', note:'Emma expanding shelf space for
    premium tier.'},
      {rep:'r3', type:'sample', entity:'BC Cannabis Store Victoria', date:'2026-03-08', note:'Left Jeeter XL. Noah
    cross-sell opp with edibles.'},
      {rep:'r1', type:'promo', entity:'Spiritleaf Kitsilano', date:'2026-03-15', note:'SHRED Spring Shredder live.
    Manager excited.'},
      {rep:'r3', type:'visit', entity:'Sessions Cannabis Nanaimo', date:'2026-03-05', note:'Dan needs Q1 data to commit
    to Spinach reorder.'},
      {rep:'r2', type:'visit', entity:'Spiritleaf Langley', date:'2026-03-02', note:'Olivia confirming expansion. Pitch
    full portfolio.'},
    ];

    Forecast Revenue (new)

    const forecastRevenue = [
      {week:'Mar 24', total:74900, forecast:true},
      {week:'Mar 31', total:77800, forecast:true},
      {week:'Apr 7',  total:80600, forecast:true},
      {week:'Apr 14', total:83400, forecast:true},
    ];

    Revenue Targets on Stores (add field)

    - Tier A stores: target = revenue30d × 1.08
    - Tier B stores: target = revenue30d × 1.18
    - Tier C stores: target = revenue30d × 1.35

    ---
    CSS Additions Needed

    /* Tooltip */
    #gw-tip {
      position:fixed; background:#1e2318; color:#fff; font-size:11px;
      line-height:1.5; padding:7px 10px; border-radius:6px; z-index:9999;
      pointer-events:none; max-width:220px; display:none;
      box-shadow:0 4px 12px rgba(0,0,0,.3);
    }

    /* Notes textarea */
    .note-area {
      width:100%; border:1px solid var(--stone-200); border-radius:6px;
      padding:10px; font-size:12px; font-family:'Lato',sans-serif;
      color:var(--stone-800); resize:vertical; min-height:80px;
      outline:none; background:var(--stone-50);
    }
    .note-area:focus { border-color:var(--green-400); }

    /* Strategy insight cards */
    .insight-card {
      background:#fff; border:1px solid var(--stone-100); border-radius:10px;
      padding:14px 16px; position:relative; overflow:hidden; margin-bottom:10px;
      display:flex; align-items:flex-start; gap:12px;
    }
    .insight-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:3px;
    }
    .insight-critical::before { background:var(--red); }
    .insight-high::before     { background:var(--amber); }
    .insight-med::before      { background:var(--blue); }

    /* Brand health bar */
    .health-bar { height:8px; border-radius:4px; background:var(--stone-100); overflow:hidden; margin-top:6px; }
    .health-fill { height:100%; border-radius:4px; transition:width .4s; }

    /* Activity feed */
    .activity-item { display:flex; gap:10px; padding:8px 0; border-bottom:1px solid var(--stone-50); }
    .activity-item:last-child { border-bottom:none; }
    .activity-dot { width:8px; height:8px; border-radius:50%; margin-top:4px; flex-shrink:0; }

    ---
    Key Design Principles

    - Single HTML file, no build tools, opens directly in browser
    - Chart.js 4.4.1 from CDN for all charts
    - Fonts: DM Mono, Syne, Lato from Google Fonts
    - All data inline in <script> tag
    - localStorage for note persistence only
    - Drawer pattern for entity detail (slide-in from right)
    - Color palette: dark stone sidebar (#141710), green accents (#2e7a19), amber/red for alerts

    ---
    Context: Who This Is For

    - Cannabis sales rep tool for BC market
    - Partner is showing this at a meeting — needs to look polished and data-rich
    - Real data not yet available; synthetic data should look realistic
    - Key use cases: visit prioritization, sample ROI tracking, stock gap intelligence, brand health, revenue
    forecasting
    - Canadian cannabis brands: Broken Coast, Tantalus Labs, Whistler, General Admission, SHRED, Spinach, Jeeter, Grön