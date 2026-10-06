import { getColor, getHandle, getMaterial } from '@/data/materials'
import { getProductById } from '@/data/products'
import type { Dimensions, PriceBreakdown, Product, ProductConfiguration } from '@/types/product'

const BASE_WIDTH_THRESHOLD = 1800
const WIDTH_SURCHARGE = 2000
const BASE_HEIGHT_THRESHOLD = 2100
const HEIGHT_SURCHARGE = 1500
const BASE_DEPTH_THRESHOLD = 600
const DEPTH_SURCHARGE = 1000

function dimensionSurcharge(product: Product, dimensions: Dimensions): number {
  const constraints = product.availableOptions.dimensions
  if (!constraints) return 0

  let delta = 0
  const baseW = constraints.width.default
  const baseH = constraints.height.default
  const baseD = constraints.depth.default

  if (dimensions.width > Math.max(baseW, BASE_WIDTH_THRESHOLD)) {
    const steps = Math.ceil((dimensions.width - Math.max(baseW, BASE_WIDTH_THRESHOLD)) / 100)
    delta += steps * (WIDTH_SURCHARGE / 6)
  }
  if (dimensions.height > Math.max(baseH, BASE_HEIGHT_THRESHOLD)) {
    const steps = Math.ceil((dimensions.height - Math.max(baseH, BASE_HEIGHT_THRESHOLD)) / 50)
    delta += steps * (HEIGHT_SURCHARGE / 6)
  }
  if (dimensions.depth > Math.max(baseD, BASE_DEPTH_THRESHOLD)) {
    const steps = Math.ceil((dimensions.depth - Math.max(baseD, BASE_DEPTH_THRESHOLD)) / 50)
    delta += steps * (DEPTH_SURCHARGE / 5)
  }

  // Simple proportional surcharge for large increases
  if (dimensions.width > BASE_WIDTH_THRESHOLD) delta += WIDTH_SURCHARGE * ((dimensions.width - BASE_WIDTH_THRESHOLD) / 600)
  if (dimensions.height > BASE_HEIGHT_THRESHOLD) delta += HEIGHT_SURCHARGE * ((dimensions.height - BASE_HEIGHT_THRESHOLD) / 300)
  if (dimensions.depth > BASE_DEPTH_THRESHOLD) delta += DEPTH_SURCHARGE * ((dimensions.depth - BASE_DEPTH_THRESHOLD) / 100)

  return Math.round(delta)
}

export function calculatePrice(config: ProductConfiguration): PriceBreakdown {
  const product = getProductById(config.productId)
  if (!product) {
    return { base: 0, materialDelta: 0, colorDelta: 0, handleDelta: 0, dimensionDelta: 0, quantity: config.quantity, unitTotal: 0, total: 0 }
  }

  const material = getMaterial(config.materialId)
  const color = getColor(config.colorId)
  const handle = config.handleId ? getHandle(config.handleId) : null

  const base = product.price
  const materialDelta = material.priceDelta
  const colorDelta = color.priceDelta
  const handleDelta = handle?.priceDelta ?? 0
  const dimDelta = dimensionSurcharge(product, config.dimensions)

  const unitTotal = Math.round(base + materialDelta + colorDelta + handleDelta + dimDelta)
  const quantity = Math.max(1, config.quantity)

  return {
    base,
    materialDelta,
    colorDelta,
    handleDelta,
    dimensionDelta: dimDelta,
    quantity,
    unitTotal,
    total: unitTotal * quantity,
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatINRShort(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}k`
  }
  return formatINR(amount)
}
