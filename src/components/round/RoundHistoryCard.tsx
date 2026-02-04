import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Users } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { getRoundStatusLabel, getRoundStatusColor } from '@/lib/round-utils'
import type { Round } from '@/types'

interface RoundHistoryCardProps {
  round: Round
}

export function RoundHistoryCard({ round }: RoundHistoryCardProps) {
  const navigate = useNavigate()
  const statusColor = getRoundStatusColor(round.status)

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/round/${round.id}`)}
    >
      <CardContent className="py-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-fairway flex-shrink-0" />
              <p className="text-sm font-medium truncate">{round.course_name}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDate(round.date)}</span>
              {round.tee_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(round.tee_time)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {round.signed_up_ids.length}
              </span>
            </div>
          </div>
          <Badge className={`text-xs flex-shrink-0 ${statusColor}`}>
            {getRoundStatusLabel(round.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
