function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function sanitizeMenuItem(doc: Record<string, unknown>) {
  const { _id, title, ...rest } = doc
  const cleaned: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === 'boolean') {
      cleaned[key] = value
      continue
    }
    if (value === '' || value === undefined || value === null) continue
    cleaned[key] = value
  }

  if (typeof title === 'string' && title.trim()) {
    cleaned.title = title.trim()
    if (!cleaned.slug) {
      cleaned.slug = { _type: 'slug', current: slugify(title) }
    }
  }

  return {
    id: typeof _id === 'string' && _id.trim() ? _id.trim() : undefined,
    data: cleaned,
  }
}

export function sanitizeCategory(doc: Record<string, unknown>) {
  const { _id, title, ...rest } = doc
  const cleaned: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === 'boolean') {
      cleaned[key] = value
      continue
    }
    if (value === '' || value === undefined || value === null) continue
    cleaned[key] = value
  }

  if (typeof title === 'string' && title.trim()) {
    cleaned.title = title.trim()
    if (!cleaned.slug) {
      cleaned.slug = { _type: 'slug', current: slugify(title) }
    }
  }

  return {
    id: typeof _id === 'string' && _id.trim() ? _id.trim() : undefined,
    data: cleaned,
  }
}
