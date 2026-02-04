import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Team } from '@/types'
import { getDemoUser } from '@/lib/demo-data'
import { useTeamStore, useUserStore } from '@/stores'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getInitials, getAvatarColor } from '@/lib/utils'
import { Shield, UserMinus, ChevronUp, ChevronDown, UserPlus, X } from 'lucide-react'

interface MemberManagementProps {
  team: Team
}

export function MemberManagement({ team }: MemberManagementProps) {
  const navigate = useNavigate()
  const removeMember = useTeamStore((s) => s.removeMember)
  const updateMemberRole = useTeamStore((s) => s.updateMemberRole)
  const addMember = useTeamStore((s) => s.addMember)
  const addUser = useUserStore((s) => s.addUser)
  const allUsers = useUserStore((s) => s.allUsers)
  const currentUserId = useUserStore((s) => s.currentUser?.id)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  const isAdmin = (userId: string) => team.admin_ids.includes(userId)

  const getRoleBadge = (userId: string) => {
    if (isAdmin(userId)) {
      return (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-xs">
        Member
      </Badge>
    )
  }

  const handlePromote = (userId: string) => {
    updateMemberRole(team.id, userId, 'admin')
  }

  const handleDemote = (userId: string) => {
    updateMemberRole(team.id, userId, 'member')
  }

  const handleRemove = (userId: string) => {
    removeMember(team.id, userId)
  }

  const getUser = (userId: string) => {
    return allUsers.find((u) => u.id === userId) ?? getDemoUser(userId)
  }

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return

    const newId = `demo-user-${Date.now()}`
    const newUser = {
      id: newId,
      email: newMemberEmail.trim(),
      password: 'shabba123',
      display_name: newMemberName.trim(),
      avatar_url: null,
      phone: null,
      handicap: null,
      ghin_number: null,
      handicap_index: null,
      venmo_username: null,
      preferred_tee_time: null,
      stats: { rounds_played: 0, average_score: null, best_score: null, total_winnings: 0, total_losses: 0, backout_count: 0 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addUser(newUser)
    addMember(team.id, newId)
    setNewMemberName('')
    setNewMemberEmail('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-3">
      {/* Add Member button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          className="gap-1.5 bg-fairway hover:bg-fairway-dark text-white"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Member list */}
      <div className="space-y-2">
        {team.member_ids.map((memberId) => {
          const user = getUser(memberId)
          if (!user) return null

          const isSelf = memberId === currentUserId
          const memberIsAdmin = isAdmin(memberId)

          return (
            <div
              key={memberId}
              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <button
                onClick={() => navigate(`/member/${memberId}`)}
                className="flex items-center gap-3 min-w-0 text-left hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className="text-white text-xs font-semibold"
                    style={{ backgroundColor: getAvatarColor(user.display_name) }}
                  >
                    {getInitials(user.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-fairway underline-offset-2 hover:underline">
                    {user.display_name}
                    {isSelf && (
                      <span className="text-muted-foreground ml-1 no-underline">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Handicap: {user.handicap ?? '—'}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {getRoleBadge(memberId)}

                {!isSelf && (
                  <div className="flex items-center gap-1">
                    {memberIsAdmin ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleDemote(memberId)}
                        title="Demote to member"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => handlePromote(memberId)}
                        title="Promote to admin"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-penalty hover:text-penalty hover:bg-penalty/10"
                      onClick={() => handleRemove(memberId)}
                      title="Remove from team"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 animate-modal-overlay"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-background rounded-xl shadow-xl p-6 w-[90%] max-w-md animate-modal-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Member</h3>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setShowAddModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full name"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-email">Email *</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim() || !newMemberEmail.trim()}
                  className="bg-fairway hover:bg-fairway-dark"
                >
                  Add to League
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
