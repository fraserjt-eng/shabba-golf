import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import { CURRENT_USER_ID } from '@/lib/demo-data'
import { Users, Check, X, DollarSign, MessageSquare, Clock } from 'lucide-react'
import type { User } from '@/types'

interface RoundSignupListProps {
  members: User[]
  signedUpIds: string[]
  onToggleSignup: (userId: string) => void
  isAdmin: boolean
}

export function RoundSignupList({
  members,
  signedUpIds,
  onToggleSignup,
  isAdmin,
}: RoundSignupListProps) {
  const [paidMap, setPaidMap] = useState<Record<string, boolean>>({})
  const [noteMap, setNoteMap] = useState<Record<string, string>>({})
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')

  const signedUpCount = members.filter((m) => signedUpIds.includes(m.id)).length

  // Sort: current user first, then signed-up, then alphabetical
  const sorted = [...members].sort((a, b) => {
    if (a.id === CURRENT_USER_ID) return -1
    if (b.id === CURRENT_USER_ID) return 1
    const aIn = signedUpIds.includes(a.id)
    const bIn = signedUpIds.includes(b.id)
    if (aIn && !bIn) return -1
    if (!aIn && bIn) return 1
    return a.display_name.localeCompare(b.display_name)
  })

  const togglePaid = (userId: string) => {
    setPaidMap((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  const openNote = (userId: string) => {
    setEditingNote(userId)
    setNoteInput(noteMap[userId] ?? '')
  }

  const saveNote = (userId: string) => {
    setNoteMap((prev) => ({ ...prev, [userId]: noteInput }))
    setEditingNote(null)
    setNoteInput('')
  }

  const canToggle = (userId: string) => userId === CURRENT_USER_ID || isAdmin

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-fairway" />
          Roster ({signedUpCount}/{members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-border/50">
          {sorted.map((member) => {
            const isSignedUp = signedUpIds.includes(member.id)
            const isCurrentUser = member.id === CURRENT_USER_ID
            const isPaid = paidMap[member.id] ?? false
            const note = noteMap[member.id]

            return (
              <div key={member.id} className="py-2.5">
                <div
                  className={cn(
                    'flex items-center gap-3 px-2 rounded-lg transition-colors',
                    isCurrentUser && 'bg-fairway/5',
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={member.avatar_url ?? undefined} alt={member.display_name} />
                    <AvatarFallback
                      style={{ backgroundColor: getAvatarColor(member.display_name) }}
                      className="text-white text-xs font-medium"
                    >
                      {getInitials(member.display_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name + Handicap + Tee Time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-sm font-medium truncate', isCurrentUser && 'text-fairway')}>
                        {member.display_name}
                        {isCurrentUser && <span className="text-muted-foreground font-normal"> (You)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {member.handicap != null && (
                        <span>{member.handicap} HCP</span>
                      )}
                      {member.preferred_tee_time && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {member.preferred_tee_time}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* In/Out toggle */}
                  <button
                    onClick={() => canToggle(member.id) && onToggleSignup(member.id)}
                    disabled={!canToggle(member.id)}
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      isSignedUp
                        ? 'bg-fairway text-white'
                        : 'bg-gray-200 text-gray-400',
                      canToggle(member.id) && 'cursor-pointer hover:opacity-80',
                      !canToggle(member.id) && 'cursor-default',
                    )}
                    title={isSignedUp ? 'Signed up' : 'Not signed up'}
                  >
                    {isSignedUp ? <Check className="h-4 w-4" /> : <X className="h-3.5 w-3.5" />}
                  </button>

                  {/* Payment badge */}
                  <button
                    onClick={() => togglePaid(member.id)}
                    className="shrink-0"
                    title={isPaid ? 'Paid' : 'Unpaid — tap to mark paid'}
                  >
                    <Badge
                      variant={isPaid ? 'default' : 'outline'}
                      className={cn(
                        'text-[10px] gap-0.5 cursor-pointer transition-colors',
                        isPaid
                          ? 'bg-fairway hover:bg-fairway-dark'
                          : 'text-muted-foreground hover:border-fairway hover:text-fairway',
                      )}
                    >
                      <DollarSign className="h-3 w-3" />6
                    </Badge>
                  </button>

                  {/* Note button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn('h-7 w-7 p-0 shrink-0', note && 'text-sky')}
                    onClick={() => openNote(member.id)}
                    title={note || 'Add note'}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Note display */}
                {note && editingNote !== member.id && (
                  <p className="text-xs text-muted-foreground ml-14 mt-1 italic">{note}</p>
                )}

                {/* Note editor */}
                {editingNote === member.id && (
                  <div className="flex items-center gap-2 ml-14 mt-1.5">
                    <Input
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="e.g. Venmo sent to Cole"
                      className="h-7 text-xs"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveNote(member.id)}
                    />
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-fairway hover:bg-fairway-dark"
                      onClick={() => saveNote(member.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No team members found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
