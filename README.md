# FORMA LIVING

Premium furniture e-commerce prototype with an interactive 3D product viewer and room planner.

**Not affiliated with IKEA or any other retail brand.** Original brand, UI, and procedural 3D furniture for demo use.

## Features

- Furniture catalogue with search, category / price filters, and sorting
- Product detail pages with live material, colour, handle, and dimension configuration
- Interactive Three.js / React Three Fiber product viewer
- Local pricing engine (INR) with option and size surcharges
- 3D room planner — add, move, rotate, duplicate, remove furniture; change materials/colours
- Cart with localStorage persistence
- Enquiry form with configuration summary (stored locally)

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Three.js + React Three Fiber + Drei
- Zustand
- React Router
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:45321](http://127.0.0.1:45321).

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Scale convention

- Product dimensions in data: **millimetres (mm)**
- Three.js scene units: **1 unit = 1 metre**
- Conversion: `mm / 1000`

## Architecture notes

- Catalogue data lives in `src/data/` — no hardcoded product copy in UI
- Pricing via `calculatePrice()` in `src/utils/pricing.ts`
- Procedural furniture meshes in `src/three/FurnitureModel.tsx` (body, doors, shelves, handles)
- Ready for GLB models later via `modelPath` + `useGLTF` without rewriting the store/UI layer
- Enquiry and cart are client-only; swap store actions for API calls when a backend is added

## Assets

See [ASSET_SOURCES.md](./ASSET_SOURCES.md). V1 uses original procedural geometry and SVG illustrations — no third-party 3D models.
