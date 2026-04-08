# Ghostweave Intel — Cannabis Sales CRM

BC cannabis sales intelligence platform for reps, brands, and stores.

**Live demo:** https://luxury-biscochitos-f0197a.netlify.app

## What's inside

```
canopycrm/          ← The app (single HTML file, no build step)
  index.html        ← Entire frontend: data, styles, logic
  netlify.toml      ← Netlify routing config
research/           ← Competitor and UX reference screenshots
```

## Deploy

Drag the `canopycrm/` folder onto [app.netlify.com](https://app.netlify.com) — live in 30 seconds.

Or via CLI:
```bash
netlify deploy --dir canopycrm --prod
```

## Stack

- Single HTML file — vanilla JS, Chart.js, no build tooling
- Netlify hosting
- Supabase (Canada Central) — planned for real data pipeline

## Roadmap

See [GitHub Issues](../../issues) for the full backlog.

## Data

Real client data (`.xlsx`) is gitignored. The app ships with representative sample data inline in `index.html`.
