'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoWhite from '@/assets/logo_white.png'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-chocolate via-chocolate/95 to-chocolate/90 flex items-center justify-center p-4">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-chocolate/80 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-cream" />
          <p className="text-cream/90 text-sm font-medium">Signing you in…</p>
        </div>
      )}

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-4 h-24 w-48 sm:h-28 sm:w-56">
            <Image
              src={logoWhite}
              alt="Yani's Blessings"
              fill
              className="object-contain"
              sizes="224px"
              priority
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream">Admin Login</h1>
          <p className="text-cream/70 text-sm mt-1">Sign in to manage your bakery</p>
        </div>

        <div className="bg-cream/95 backdrop-blur-sm rounded-2xl shadow-xl border border-cream/30 p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="username" className="text-chocolate">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="mt-1.5 rounded-xl bg-background"
                autoComplete="username"
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-chocolate">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="rounded-xl pr-10 bg-background"
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
