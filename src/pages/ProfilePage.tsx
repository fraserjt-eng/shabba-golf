import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { GhinCard } from '@/components/profile/GhinCard'
import { useUserStore, useTeamStore, useRoundStore } from '@/stores'
import { getInitials, getAvatarColor, formatCurrency } from '@/lib/utils'
import { Settings, LogOut, Edit2, Save, X, Users, Shield } from 'lucide-react'

export function ProfilePage() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const updateProfile = useUserStore((s) => s.updateProfile)
  const logout = useUserStore((s) => s.logout)
  const { teams } = useTeamStore()
  const { rounds } = useRoundStore()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.display_name)
      setEditEmail(currentUser.email)
      setEditPhone(currentUser.phone ?? '')
    }
  }, [currentUser])

  const userTeams = useMemo(() => {
    if (!currentUser) return []
    return teams.filter((t) => t.member_ids.includes(currentUser.id))
  }, [teams, currentUser])

  const activeCourse = useMemo(() => {
    const nextRound = rounds
      .filter((r) => r.status === 'signup_open' || r.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    if (!nextRound?.slope_rating || !nextRound?.course_rating || !nextRound?.par) return null
    return {
      name: nextRound.course_name,
      slopeRating: nextRound.slope_rating,
      courseRating: nextRound.course_rating,
      par: nextRound.par,
    }
  }, [rounds])

  if (!currentUser) return null

  const handleSave = () => {
    updateProfile({
      display_name: editName,
      email: editEmail,
      phone: editPhone || null,
    })
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleGhinUpdate = (ghinNumber: string, handicapIndex: number) => {
    updateProfile({
      ghin_number: ghinNumber,
      handicap_index: handicapIndex,
    } as Record<string, unknown>)
  }

  const stats = currentUser.stats
  const netWinnings = (stats?.total_winnings ?? 0) - (stats?.total_losses ?? 0)

  return (
    <div className="px-4 py-6 space-y-6">
      <ScrollFadeIn>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback
                  className="text-white text-xl font-semibold"
                  style={{ backgroundColor: getAvatarColor(currentUser.display_name) }}
                >
                  {getInitials(currentUser.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9"
                      placeholder="Display name"
                    />
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="h-9"
                      placeholder="Email"
                    />
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="h-9"
                      placeholder="Phone (optional)"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold truncate">{currentUser.display_name}</h2>
                    <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
                    {currentUser.phone && (
                      <p className="text-xs text-muted-foreground">{currentUser.phone}</p>
                    )}
                  </>
                )}
              </div>
              {editing ? (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={handleSave}>
                    <Save className="h-4 w-4 text-fairway" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      <ScrollFadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Handicap</span>
              <span className="font-stats font-medium">{currentUser.handicap ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Handicap Index</span>
              <span className="font-stats font-medium">
                {currentUser.handicap_index?.toFixed(1) ?? '—'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rounds Played</span>
              <span className="font-stats font-medium">{stats?.rounds_played ?? 0}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Score</span>
              <span className="font-stats font-medium">{stats?.average_score ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-stats font-medium">{stats?.best_score ?? '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net Winnings</span>
              <span className={`font-stats font-medium ${netWinnings >= 0 ? 'text-fairway' : 'text-penalty'}`}>
                {netWinnings >= 0 ? '+' : ''}{formatCurrency(netWinnings)}
              </span>
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      <ScrollFadeIn delay={200}>
        <GhinCard
          ghinNumber={currentUser.ghin_number ?? null}
          handicapIndex={currentUser.handicap_index ?? null}
          onUpdate={handleGhinUpdate}
          activeCourse={activeCourse}
        />
      </ScrollFadeIn>

      <ScrollFadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4 text-fairway" />
              My Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userTeams.map((team) => {
              const isAdmin = team.admin_ids.includes(currentUser.id)
              return (
                <div key={team.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.member_ids.length} members
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    {isAdmin && (
                      <Link to="/admin">
                        <Button size="sm" variant="ghost" className="gap-1 text-xs">
                          <Shield className="h-3.5 w-3.5" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/team/settings">
                        <Button size="sm" variant="ghost">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </ScrollFadeIn>

      <ScrollFadeIn delay={400}>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-penalty"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </ScrollFadeIn>
    </div>
  )
}
