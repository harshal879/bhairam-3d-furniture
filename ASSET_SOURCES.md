# Asset sources — Bhairam

This prototype avoids third-party 3D models and textures with unclear licenses.

## 3D furniture & room geometry

| Asset | Source | License | Notes |
|-------|--------|---------|-------|
| All furniture (wardrobe, sofa, bed, table, chair, TV unit, cabinet, rug, lamp, plant) | Original procedural Three.js geometry in `src/three/FurnitureModel.tsx` | Original / project-owned | Body, doors, shelves, and handles are separate meshes where applicable |
| Room shell (floor, walls, ceiling, window) | Original procedural geometry in `src/three/RoomScene.tsx` | Original / project-owned | Stylised presentation room |
| Environment lighting | `@react-three/drei` `Environment` presets (`apartment`) | Per drei / Three.js package licenses | HDRI presets bundled by drei |

No GLB/GLTF files are shipped in V1. Product `modelPath` fields are `null` and resolve to procedural meshes. When adding external models later, record name, source URL, and license here before use. Prefer CC0 / public domain / clearly commercial-permissive licenses only.

## 2D / UI imagery

| Asset | Source | License | Notes |
|-------|--------|---------|-------|
| Product card illustrations | Inline SVG in `src/components/product/ProductImage.tsx` | Original | Category-based silhouettes tinted by material colour |
| Home hero atmosphere | Inline SVG + CSS gradient in `src/pages/Home.tsx` | Original | Not a stock photo |
| Favicon | `public/favicon.svg` | Original | |
| Fonts | [Fraunces](https://fonts.google.com/specimen/Fraunces), [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts | [SIL Open Font License](https://scripts.sil.org/OFL) | |

## Textures

No external PBR texture packs are used in V1. Materials are `MeshStandardMaterial` with solid colours and roughness/metalness from `src/data/materials.ts`.

## Future asset policy

1. Verify license before download.
2. Prefer Poly Haven, ambientCG (CC0), or other clearly permissive sources.
3. Document every asset in this file.
4. If license is unclear — do not use; keep procedural placeholders.
