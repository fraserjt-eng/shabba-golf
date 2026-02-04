import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Hash, TrendingDown } from 'lucide-react'
import { lookupGhinHandicap, calculateCourseHandicap } from '@/lib/ghin'

interface GhinCardProps {
  ghinNumber: string | null
  handicapIndex: number | null
  onUpdate: (ghinNumber: string, handicapIndex: number) => void
  activeCourse?: {
    name: string
    slopeRating: number
    courseRating: number
    par: number
  } | null
}

export function GhinCard({ ghinNumber, handicapIndex, onUpdate, activeCourse }: GhinCardProps) {
  const [inputValue, setInputValue] = useState(ghinNumber ?? '')
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const handleSync = async () => {
    if (!inputValue.trim()) return
    setSyncing(true)
    setSyncError(null)

    const result = await lookupGhinHandicap(inputValue.trim())
    if (result) {
      onUpdate(inputValue.trim(), result.handicapIndex)
    } else {
      setSyncError('GHIN number not found')
    }
    setSyncing(false)
  }

  const courseHandicap = handicapIndex != null && activeCourse
    ? calculateCourseHandicap(
        handicapIndex,
        activeCourse.slopeRating,
        activeCourse.courseRating,
        activeCourse.par,
      )
    : null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Hash className="h-4 w-4 text-fairway" />
          GHIN Handicap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="GHIN Number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSync}
            disabled={syncing || !inputValue.trim()}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>

        {syncError && (
          <p className="text-sm text-penalty">{syncError}</p>
        )}

        {handicapIndex != null && (
          <div className="bg-surface-green rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Handicap Index</span>
              <Badge variant="secondary" className="font-stats text-lg px-3 py-1">
                {handicapIndex.toFixed(1)}
              </Badge>
            </div>

            {courseHandicap != null && activeCourse && (
              <div className="flex items-center justify-between border-t border-fairway/10 pt-3">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-fairway" />
                  <span className="text-sm text-muted-foreground">
                    Course HC ({activeCourse.name.split(' ').slice(0, 2).join(' ')})
                  </span>
                </div>
                <span className="font-stats font-semibold text-fairway">{courseHandicap}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
