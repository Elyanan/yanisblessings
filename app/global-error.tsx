'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#FFF7ED', margin: 0, padding: '2rem' }}>
        <main style={{ maxWidth: '28rem', margin: '4rem auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
            A critical error occurred. Please refresh the page or try again later.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#8B4513',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
