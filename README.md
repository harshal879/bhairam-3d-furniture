# Bhairam — 3D Furniture Configurator

Early-stage product website for **Bhairam** ([bhairam.in](https://bhairam.in)): an interactive 3D furniture visualization and configuration platform for furniture businesses.

## What this repo includes

- Startup landing page (hero, live 3D demo, problem/solution, features, roadmap, about, CTA)
- Existing interactive 3D product viewer and material/colour configuration
- 3D room planner
- Demo catalogue, cart and enquiry flows
- View in Your Room (camera overlay on mobile)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:45321](http://127.0.0.1:45321).

## Production build

```bash
npm run build
npm run preview
```

Preview serves on port **45322** by default.

## Stack

React · TypeScript · Vite · Three.js · React Three Fiber · Zustand · Tailwind CSS · React Router

## Notes

- Demo furniture data is sample content for showcasing the product.
- Scale convention: product dimensions in mm; Three.js units in metres (`mm / 1000`).
- See `ASSET_SOURCES.md` for 3D asset licensing notes.
