import { MM_TO_METERS } from '@/types/product'
import type { DimensionConstraints, Dimensions } from '@/types/product'

/** Convert millimetres to Three.js metres. */
export function mmToMeters(mm: number): number {
  return mm * MM_TO_METERS
}

/** Convert Three.js metres to millimetres. */
export function metersToMm(m: number): number {
  return Math.round(m / MM_TO_METERS)
}

export function formatDimensions(d: Dimensions): string {
  return `${d.width} × ${d.height} × ${d.depth} mm`
}

export function formatDimensionShort(d: Dimensions): string {
  return `${(d.width / 10).toFixed(0)} × ${(d.depth / 10).toFixed(0)} cm`
}

export function clampDimension(
  value: number,
  axis: keyof Dimensions,
  constraints?: DimensionConstraints,
): number {
  if (!constraints) return value
  const c = constraints[axis]
  const stepped = Math.round(value / c.step) * c.step
  return Math.min(c.max, Math.max(c.min, stepped))
}

export function defaultDimensions(constraints?: DimensionConstraints, fallback?: Dimensions): Dimensions {
  if (constraints) {
    return {
      width: constraints.width.default,
      height: constraints.height.default,
      depth: constraints.depth.default,
    }
  }
  return fallback ?? { width: 1000, height: 1000, depth: 500 }
}

/** Scale factors relative to a product's base dimensions for proportional 3D scaling. */
export function scaleFactors(current: Dimensions, base: Dimensions): [number, number, number] {
  return [
    current.width / base.width,
    current.height / base.height,
    current.depth / base.depth,
  ]
}
