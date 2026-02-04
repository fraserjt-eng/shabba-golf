import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores'
import { LogIn } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, error, clearError, loading } = useUserStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email.trim() || !password.trim()) return

    const success = await login(email.trim(), password)
    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      {/* Hero background with dissolve */}
      <div className="hero-dissolve absolute inset-0 h-[55vh]">
        <img
          src="/images/hero-course.jpg"
          alt="Golf course"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-[10vh] px-4 animate-slideIn">
        {/* Logo + tagline over the image */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-3xl font-bold shadow-lg font-heading">
            SG
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg font-heading">ShaBBa Golf</h1>
          <p className="text-white/80 text-sm font-medium drop-shadow">Sign in to your account</p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm space-y-5">
          <Card className="glass-card shadow-xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-penalty text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={!email.trim() || !password.trim() || loading}
                  className="w-full h-11 gap-2 bg-fairway hover:bg-fairway-dark text-white shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Not a member?{' '}
            <Link to="/register" className="text-fairway font-semibold hover:underline">
              Create account
            </Link>
          </p>

          <p className="text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              &larr; Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
