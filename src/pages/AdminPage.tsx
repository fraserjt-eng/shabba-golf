import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { MemberManagement } from '@/components/admin/MemberManagement'
import { BackoutFeeEditor } from '@/components/admin/BackoutFeeEditor'
import { useUserStore, useTeamStore, useRoundStore } from '@/stores'
import { getDemoUser } from '@/lib/demo-data'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import {
  Shield,
  Users,
  CalendarDays,
  Settings,
  Save,
  Trash2,
  Edit2,
  X,
} from 'lucide-react'
import type { RoundStatus, Team, Round } from '@/types'

type AdminTab = 'members' | 'rounds' | 'settings'

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('members')
  const currentUser = useUserStore((s) => s.currentUser)
  const updateUserProfile = useUserStore((s) => s.updateUserProfile)
  const { activeTeamId, activeTeam: getActiveTeam, updateTeam } = useTeamStore()
  const activeTeam = getActiveTeam()
  const { rounds, updateRound, deleteRound } = useRoundStore()

  const isAdmin = activeTeam?.admin_ids.includes(currentUser?.id ?? '') ?? false

  if (!isAdmin || !activeTeam) {
    return (
      <div className="px-4 py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold">Admin Access Required</h2>
        <p className="text-sm text-muted-foreground mt-1">
          You need admin privileges to access this page.
        </p>
      </div>
    )
  }

  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: 'members', label: 'Members', icon: Users },
    { key: 'rounds', label: 'Rounds', icon: CalendarDays },
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="px-4 py-6 space-y-6">
      <ScrollFadeIn>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-fairway" />
          <h1 className="text-xl font-bold">Admin</h1>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                activeTab === key
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </ScrollFadeIn>

      {activeTab === 'members' && (
        <ScrollFadeIn delay={100}>
          <MembersTab
            team={activeTeam}
            updateUserProfile={updateUserProfile}
          />
        </ScrollFadeIn>
      )}

      {activeTab === 'rounds' && (
        <ScrollFadeIn delay={100}>
          <RoundsTab
            rounds={rounds}
            updateRound={updateRound}
            deleteRound={deleteRound}
          />
        </ScrollFadeIn>
      )}

      {activeTab === 'settings' && (
        <ScrollFadeIn delay={100}>
          <SettingsTab
            team={activeTeam}
            teamId={activeTeamId!}
            updateTeam={updateTeam}
          />
        </ScrollFadeIn>
      )}
    </div>
  )
}

/* ───────── Members Tab ───────── */

function MembersTab({
  team,
  updateUserProfile,
}: {
  team: Team
  updateUserProfile: (userId: string, updates: Record<string, unknown>) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, string>>({})

  const startEditing = (userId: string) => {
    const user = getDemoUser(userId)
    if (!user) return
    setEditingId(userId)
    setEditFields({
      display_name: user.display_name,
      email: user.email,
      handicap: user.handicap?.toString() ?? '',
      venmo_username: user.venmo_username ?? '',
      ghin_number: user.ghin_number ?? '',
    })
  }

  const saveEdit = (userId: string) => {
    updateUserProfile(userId, {
      display_name: editFields.display_name,
      email: editFields.email,
      handicap: editFields.handicap ? Number(editFields.handicap) : null,
      venmo_username: editFields.venmo_username || null,
      ghin_number: editFields.ghin_number || null,
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <MemberManagement team={team} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {team.member_ids.map((memberId) => {
            const user = getDemoUser(memberId)
            if (!user) return null
            const isEditing = editingId === memberId

            return (
              <div key={memberId} className="border border-border/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className="text-white text-xs font-semibold"
                      style={{ backgroundColor: getAvatarColor(user.display_name) }}
                    >
                      {getInitials(user.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.display_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => isEditing ? setEditingId(null) : startEditing(memberId)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>

                {isEditing && (
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={editFields.display_name}
                          onChange={(e) => setEditFields((f) => ({ ...f, display_name: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input
                          value={editFields.email}
                          onChange={(e) => setEditFields((f) => ({ ...f, email: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Handicap</Label>
                        <Input
                          type="number"
                          value={editFields.handicap}
                          onChange={(e) => setEditFields((f) => ({ ...f, handicap: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Venmo</Label>
                        <Input
                          value={editFields.venmo_username}
                          onChange={(e) => setEditFields((f) => ({ ...f, venmo_username: e.target.value }))}
                          className="h-8 text-sm"
                          placeholder="@username"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">GHIN #</Label>
                        <Input
                          value={editFields.ghin_number}
                          onChange={(e) => setEditFields((f) => ({ ...f, ghin_number: e.target.value }))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-fairway hover:bg-fairway-dark gap-1"
                      onClick={() => saveEdit(memberId)}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

/* ───────── Rounds Tab ───────── */

const ROUND_STATUSES: RoundStatus[] = [
  'upcoming',
  'signup_open',
  'locked',
  'in_progress',
  'completed',
  'cancelled',
]

function RoundsTab({
  rounds,
  updateRound,
  deleteRound,
}: {
  rounds: Round[]
  updateRound: (roundId: string, updates: Record<string, unknown>) => void
  deleteRound: (roundId: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, string>>({})

  const sortedRounds = useMemo(() => {
    return [...rounds].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [rounds])

  const startEditing = (round: (typeof rounds)[number]) => {
    setEditingId(round.id)
    setEditFields({
      course_name: round.course_name,
      tee_time: round.tee_time ?? '',
      date: round.date,
      status: round.status,
      notes: round.notes ?? '',
    })
  }

  const saveEdit = (roundId: string) => {
    updateRound(roundId, {
      course_name: editFields.course_name,
      tee_time: editFields.tee_time || null,
      date: editFields.date,
      status: editFields.status as RoundStatus,
      notes: editFields.notes || null,
    })
    setEditingId(null)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'signup_open': return 'bg-fairway text-white'
      case 'in_progress': return 'bg-sky text-white'
      case 'completed': return 'bg-muted text-foreground'
      case 'cancelled': return 'bg-penalty/10 text-penalty'
      case 'locked': return 'bg-trophy/10 text-trophy'
      default: return 'bg-muted text-foreground'
    }
  }

  return (
    <div className="space-y-3">
      {sortedRounds.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No rounds found.</p>
      )}
      {sortedRounds.map((round) => {
        const isEditing = editingId === round.id
        return (
          <Card key={round.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{round.course_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(round.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {round.tee_time && ` at ${round.tee_time}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge className={cn('text-[10px]', statusColor(round.status))}>
                    {round.status.replace('_', ' ')}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => isEditing ? setEditingId(null) : startEditing(round)}
                  >
                    {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-penalty hover:text-penalty hover:bg-penalty/10"
                    onClick={() => deleteRound(round.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Label className="text-xs">Course</Label>
                      <Input
                        value={editFields.course_name}
                        onChange={(e) => setEditFields((f) => ({ ...f, course_name: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input
                        type="date"
                        value={editFields.date}
                        onChange={(e) => setEditFields((f) => ({ ...f, date: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tee Time</Label>
                      <Input
                        value={editFields.tee_time}
                        onChange={(e) => setEditFields((f) => ({ ...f, tee_time: e.target.value }))}
                        className="h-8 text-sm"
                        placeholder="5:30 PM"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Status</Label>
                      <select
                        value={editFields.status}
                        onChange={(e) => setEditFields((f) => ({ ...f, status: e.target.value }))}
                        className="w-full h-8 text-sm rounded-md border border-input bg-background px-2"
                      >
                        {ROUND_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Notes</Label>
                      <Input
                        value={editFields.notes}
                        onChange={(e) => setEditFields((f) => ({ ...f, notes: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-fairway hover:bg-fairway-dark gap-1"
                    onClick={() => saveEdit(round.id)}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/* ───────── Settings Tab ───────── */

function SettingsTab({
  team,
  teamId,
  updateTeam,
}: {
  team: Team
  teamId: string
  updateTeam: (teamId: string, updates: Record<string, unknown>) => void
}) {
  const [teamName, setTeamName] = useState(team.name)
  const [teamDesc, setTeamDesc] = useState(team.description ?? '')
  const [saved, setSaved] = useState(false)

  const hasChanges = teamName !== team.name || teamDesc !== (team.description ?? '')

  const handleSaveTeam = () => {
    updateTeam(teamId, {
      name: teamName,
      description: teamDesc || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const feeSchedule = team.settings?.backout_fee_schedule ?? {
    before_lock: 5,
    after_lock: 15,
    no_show: 25,
  }

  const handleSaveFees = (fees: { before_lock: number; after_lock: number; no_show: number }) => {
    updateTeam(teamId, {
      settings: {
        ...team.settings,
        backout_fee_schedule: fees,
      },
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-fairway" />
            Team Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Team Name</Label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Input
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              className="h-9"
              placeholder="Optional description"
            />
          </div>
          {team.invite_code && (
            <div>
              <Label className="text-xs">Invite Code</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono text-sm px-3 py-1">
                  {team.invite_code}
                </Badge>
              </div>
            </div>
          )}
          <Button
            className="w-full bg-fairway hover:bg-fairway-dark gap-1"
            onClick={handleSaveTeam}
            disabled={!hasChanges && !saved}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Saved!' : 'Save Team Info'}
          </Button>
        </CardContent>
      </Card>

      <BackoutFeeEditor feeSchedule={feeSchedule} onSave={handleSaveFees} />
    </div>
  )
}
