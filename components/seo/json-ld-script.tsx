type JsonLdScriptProps = {
  data: object | object[]
  id?: string
}

/** Server-safe JSON-LD — use plain script tags (not next/script). */
export function JsonLdScript({ data, id = 'json-ld' }: JsonLdScriptProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${id}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
