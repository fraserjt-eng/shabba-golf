import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { MemberManagement } from '@/components/admin/MemberManagement'
import { InviteModal } from '@/components/admin/InviteModal'
import { BackoutFeeEditor } from '@/components/admin/BackoutFeeEditor'
import { TeamDangerZone } from '@/components/admin/TeamDangerZone'
import { useTeamStore, useUserStore } from '@/stores'
import { Settings, ArrowLeft, Save, Users, Mail } from 'lucide-react'

export function TeamSettingsPage() {
  const navigate = useNavigate()
  const activeTeam = useTeamStore((s) => s.activeTeam)()
  const updateTeam = useTeamStore((s) => s.updateTeam)
  const currentUser = useUserStore((s) => s.currentUser)

  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [infoSaved, setInfoSaved] = useState(false)

  useEffect(() => {
    if (activeTeam) {
      setTeamName(activeTeam.name)
      setTeamDescription(activeTeam.description ?? '')
    }
  }, [activeTeam])

  // Redirect if not admin
  useEffect(() => {
    if (activeTeam && currentUser && !activeTeam.admin_ids.includes(currentUser.id)) {
      navigate('/profile', { replace: true })
    }
  }, [activeTeam, currentUser, navigate])

  if (!activeTeam || !currentUser) return null

  const isAdmin = activeTeam.admin_ids.includes(currentUser.id)
  if (!isAdmin) return null

  const handleSaveInfo = () => {
    updateTeam(activeTeam.id, {
      name: teamName,
      description: teamDescription || null,
    })
    setInfoSaved(true)
    setTimeout(() => setInfoSaved(false), 2000)
  }

  const handleSaveFees = (fees: { before_lock: number; after_lock: number; no_show: number }) => {
    const currentSettings = activeTeam.settings ?? {
      backout_fee_schedule: fees,
      default_game_types: [],
      require_signup: true,
    }
    updateTeam(activeTeam.id, {
      settings: {
        ...currentSettings,
        backout_fee_schedule: fees,
      },
    })
  }

  const handleDeleteTeam = () => {
    // In a real app, this would call a delete endpoint
    // For demo, navigate away
    navigate('/profile', { replace: true })
  }

  const hasInfoChanges =
    teamName !== activeTeam.name ||
    (teamDescription || null) !== (activeTeam.description || null)

  const feeSchedule = activeTeam.settings?.backout_fee_schedule ?? {
    before_lock: 0,
    after_lock: 0,
    no_show: 0,
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-fairway" />
          <h1 className="text-xl font-semibold">Team Settings</h1>
        </div>
      </div>

      {/* Team Info */}
      <ScrollFadeIn>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Name</label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Enter team description (optional)"
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleSaveInfo}
              disabled={!hasInfoChanges && !infoSaved}
            >
              <Save className="h-4 w-4" />
              {infoSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Members */}
      <ScrollFadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4 text-fairway" />
              Members ({activeTeam.member_ids.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemberManagement team={activeTeam} />
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Invite */}
      <ScrollFadeIn delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-4 w-4 text-fairway" />
              Invite Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Share the invite code or link to add new members to the team.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setInviteOpen(true)}
            >
              Show Invite Code
            </Button>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {activeTeam.invite_code && (
        <InviteModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          inviteCode={activeTeam.invite_code}
        />
      )}

      {/* Backout Fees */}
      <ScrollFadeIn delay={300}>
        <BackoutFeeEditor
          feeSchedule={feeSchedule}
          onSave={handleSaveFees}
        />
      </ScrollFadeIn>

      {/* Danger Zone */}
      <ScrollFadeIn delay={400}>
        <TeamDangerZone
          teamName={activeTeam.name}
          onDelete={handleDeleteTeam}
        />
      </ScrollFadeIn>
    </div>
  )
}
