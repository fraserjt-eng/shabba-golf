import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/stores'
import { getInitials, getAvatarColor } from '@/lib/utils'
import { ArrowLeft, Save, ExternalLink } from 'lucide-react'

export function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { allUsers, updateUserProfile, currentUser } = useUserStore()

  const user = allUsers.find((u) => u.id === id)
  const isCurrentUser = id === currentUser?.id
  const isAdmin = currentUser?.id === 'demo-user-001' // Josh is admin

  const canEdit = isCurrentUser || isAdmin

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    venmo_username: '',
    ghin_number: '',
    handicap: '',
    handicap_index: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email ?? '',
        phone: user.phone ?? '',
        venmo_username: user.venmo_username ?? '',
        ghin_number: user.ghin_number ?? '',
        handicap: user.handicap?.toString() ?? '',
        handicap_index: user.handicap_index?.toString() ?? '',
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">Member not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    updateUserProfile(user.id, {
      email: formData.email || undefined,
      phone: formData.phone || null,
      venmo_username: formData.venmo_username || null,
      ghin_number: formData.ghin_number || null,
      handicap: formData.handicap ? Number(formData.handicap) : null,
      handicap_index: formData.handicap_index ? Number(formData.handicap_index) : null,
    })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="px-4 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback
              className="text-white text-xl font-semibold"
              style={{ backgroundColor: getAvatarColor(user.display_name) }}
            >
              {getInitials(user.display_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.display_name}</h1>
            {isCurrentUser && (
              <Badge variant="secondary" className="text-xs mt-1">You</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Season Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-stats text-lg font-bold">{user.stats?.rounds_played ?? 0}</p>
                <p className="text-xs text-muted-foreground">Rounds</p>
              </div>
              <div>
                <p className="font-stats text-lg font-bold">{user.stats?.average_score ?? '—'}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="font-stats text-lg font-bold">{user.stats?.best_score ?? '—'}</p>
                <p className="text-xs text-muted-foreground">Best</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Profile
            </CardTitle>
            {canEdit && !editing && (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venmo">Venmo Username</Label>
                  <Input
                    id="venmo"
                    value={formData.venmo_username}
                    onChange={(e) => setFormData({ ...formData, venmo_username: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ghin">GHIN Number</Label>
                  <Input
                    id="ghin"
                    value={formData.ghin_number}
                    onChange={(e) => setFormData({ ...formData, ghin_number: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="handicap">Handicap</Label>
                    <Input
                      id="handicap"
                      type="number"
                      value={formData.handicap}
                      onChange={(e) => setFormData({ ...formData, handicap: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="index">Handicap Index</Label>
                    <Input
                      id="index"
                      type="number"
                      step="0.1"
                      value={formData.handicap_index}
                      onChange={(e) => setFormData({ ...formData, handicap_index: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="gap-1.5 bg-fairway hover:bg-fairway-dark">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phone ?? '—'} />
                <InfoRow label="Venmo" value={user.venmo_username ? `@${user.venmo_username}` : '—'} />
                <InfoRow label="GHIN" value={user.ghin_number ?? '—'} />
                <InfoRow label="Handicap" value={user.handicap?.toString() ?? '—'} />
                <InfoRow label="Index" value={user.handicap_index?.toString() ?? '—'} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* GHIN Lookup Link */}
        {user.ghin_number && (
          <a
            href={`https://www.ghin.com/golfer/${user.ghin_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-fairway hover:underline px-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View GHIN Profile
          </a>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
