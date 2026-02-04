import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUserStore, useTeamStore } from '@/stores'
import { demoTeams } from '@/lib/demo-data'
import { UserPlus } from 'lucide-react'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, error, clearError, loading } = useUserStore()
  const addMember = useTeamStore((s) => s.addMember)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [venmo, setVenmo] = useState('')
  const [ghin, setGhin] = useState('')
  const [formError, setFormError] = useState('')

  const allFilled = displayName.trim() && email.trim() && password.trim() && venmo.trim() && ghin.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setFormError('')

    if (!allFilled) {
      setFormError('All fields are required')
      return
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }

    const success = await register({
      email: email.trim(),
      password,
      displayName: displayName.trim(),
      venmo: venmo.trim(),
      ghin: ghin.trim(),
    })

    if (success) {
      // Add to the first team (Wednesday Night League)
      if (demoTeams.length > 0) {
        const currentUser = useUserStore.getState().currentUser
        if (currentUser) {
          addMember(demoTeams[0].id, currentUser.id)
        }
      }
      navigate('/dashboard', { replace: true })
    }
  }

  const displayError = formError || error

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      {/* Hero background with dissolve */}
      <div className="hero-dissolve absolute inset-0 h-[40vh]">
        <img
          src="/images/hero-course.jpg"
          alt="Golf course"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-[6vh] px-4 animate-slideIn">
        {/* Logo over image */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-3xl font-bold shadow-lg font-heading">
            SG
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg font-heading">Join ShaBBa Golf</h1>
          <p className="text-white/80 text-sm font-medium drop-shadow">Create your account</p>
        </div>

        {/* Register card */}
        <div className="w-full max-w-sm space-y-5 pb-8">
          <Card className="glass-card shadow-xl border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-foreground">New Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name *</Label>
                  <Input
                    id="reg-name"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email *</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password *</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-venmo">Venmo *</Label>
                    <Input
                      id="reg-venmo"
                      placeholder="@username"
                      value={venmo}
                      onChange={(e) => setVenmo(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-ghin">GHIN # *</Label>
                    <Input
                      id="reg-ghin"
                      placeholder="e.g. 2270337"
                      value={ghin}
                      onChange={(e) => setGhin(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                {displayError && (
                  <p className="text-xs text-penalty text-center">{displayError}</p>
                )}

                <Button
                  type="submit"
                  disabled={!allFilled || loading}
                  className="w-full h-11 gap-2 bg-fairway hover:bg-fairway-dark text-white shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  {loading ? 'Creating account...' : 'Join the League'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already a member?{' '}
            <Link to="/login" className="text-fairway font-semibold hover:underline">
              Sign in
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
