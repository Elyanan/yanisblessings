export const GRANOLA_CATEGORY_SLUG = 'granola'

export type GranolaSizeKey = '1kg' | '0.5kg'

export type GranolaSizeOption = {
  key: GranolaSizeKey
  label: string
  labelAm: string
  multiplier: number
}

export const GRANOLA_SIZES: GranolaSizeOption[] = [
  { key: '1kg', label: '1 KG', labelAm: '1 ኪ.ግ', multiplier: 1 },
  { key: '0.5kg', label: '0.5 KG', labelAm: '0.5 ኪ.ግ', multiplier: 0.5 },
]

export function isGranolaProduct(category: string): boolean {
  return category.toLowerCase().includes(GRANOLA_CATEGORY_SLUG)
}

export function getGranolaSizeOption(key: GranolaSizeKey): GranolaSizeOption {
  return GRANOLA_SIZES.find((s) => s.key === key) ?? GRANOLA_SIZES[0]
}

export function getGranolaPrice(basePriceKg: number, sizeKey: GranolaSizeKey): number {
  const size = getGranolaSizeOption(sizeKey)
  return Math.round(basePriceKg * size.multiplier)
}

export function cartLineId(productId: string, sizeKey?: GranolaSizeKey): string {
  return sizeKey ? `${productId}::${sizeKey}` : productId
}

export function parseCartLineId(lineId: string): { productId: string; sizeKey?: GranolaSizeKey } {
  const [productId, sizeKey] = lineId.split('::')
  if (sizeKey === '1kg' || sizeKey === '0.5kg') {
    return { productId, sizeKey }
  }
  return { productId: lineId }
}

export function formatItemNameWithSize(
  baseName: string,
  sizeLabel?: string,
): string {
  return sizeLabel ? `${baseName} (${sizeLabel})` : baseName
}

export function buildGranolaSizes(basePriceKg: number) {
  return GRANOLA_SIZES.map((size) => ({
    name: size.label,
    price: getGranolaPrice(basePriceKg, size.key),
  }))
}
