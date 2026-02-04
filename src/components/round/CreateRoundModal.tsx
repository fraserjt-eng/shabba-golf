import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CourseInput } from './CourseInput'
import { useRoundStore } from '@/stores/roundStore'
import { useUserStore } from '@/stores/userStore'
import { useTeamStore } from '@/stores/teamStore'
import { CalendarPlus } from 'lucide-react'

interface CreateRoundModalProps {
  open: boolean
  onClose: () => void
}

export function CreateRoundModal({ open, onClose }: CreateRoundModalProps) {
  const currentUser = useUserStore((s) => s.currentUser)
  const activeTeamId = useTeamStore((s) => s.activeTeamId)
  const createRound = useRoundStore((s) => s.createRound)

  const [courseName, setCourseName] = useState('')
  const [slopeRating, setSlopeRating] = useState('')
  const [courseRating, setCourseRating] = useState('')
  const [par, setPar] = useState('72')
  const [date, setDate] = useState('')
  const [teeTime, setTeeTime] = useState('08:30')
  const [maxPlayers, setMaxPlayers] = useState('8')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !activeTeamId || !courseName || !date) return

    setSubmitting(true)
    await createRound({
      team_id: activeTeamId,
      course_name: courseName,
      date: new Date(date).toISOString(),
      tee_time: teeTime || null,
      status: 'signup_open',
      signup_deadline: null,
      max_players: maxPlayers ? parseInt(maxPlayers) : null,
      signed_up_ids: [currentUser.id],
      slope_rating: slopeRating ? parseFloat(slopeRating) : null,
      course_rating: courseRating ? parseFloat(courseRating) : null,
      par: par ? parseInt(par) : null,
      created_by: currentUser.id,
      notes: notes || null,
    })
    setSubmitting(false)
    onClose()
    // Reset form
    setCourseName('')
    setSlopeRating('')
    setCourseRating('')
    setPar('72')
    setDate('')
    setTeeTime('08:30')
    setMaxPlayers('8')
    setNotes('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Round">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CourseInput
          courseName={courseName}
          slopeRating={slopeRating}
          courseRating={courseRating}
          par={par}
          onCourseNameChange={setCourseName}
          onSlopeRatingChange={setSlopeRating}
          onCourseRatingChange={setCourseRating}
          onParChange={setPar}
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Tee Time</label>
            <Input
              type="time"
              value={teeTime}
              onChange={(e) => setTeeTime(e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Max Players</label>
          <Input
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            className="h-11 w-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Notes (optional)</label>
          <Input
            placeholder="Cart path only, pin positions, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-11"
          />
        </div>

        <Button type="submit" className="w-full h-11 gap-2" disabled={submitting || !courseName || !date}>
          <CalendarPlus className="h-4 w-4" />
          {submitting ? 'Creating...' : 'Create Round'}
        </Button>
      </form>
    </Modal>
  )
}
