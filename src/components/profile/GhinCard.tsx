import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hash, TrendingDown, Save } from 'lucide-react'
import { calculateCourseHandicap } from '@/lib/ghin'

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
  const [indexInput, setIndexInput] = useState(handicapIndex?.toFixed(1) ?? '')
  const [ghinInput, setGhinInput] = useState(ghinNumber ?? '')
  const [saved, setSaved] = useState(false)

  const parsedIndex = parseFloat(indexInput)
  const isValid = !isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex <= 54

  const handleSave = () => {
    if (!isValid) return
    onUpdate(ghinInput.trim(), parsedIndex)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          Handicap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Handicap Index</label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="54"
              placeholder="e.g. 7.7"
              value={indexInput}
              onChange={(e) => { setIndexInput(e.target.value); setSaved(false) }}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">GHIN # (optional)</label>
            <Input
              placeholder="e.g. 2270337"
              value={ghinInput}
              onChange={(e) => { setGhinInput(e.target.value); setSaved(false) }}
              className="mt-1"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid || saved}
            className="w-full gap-1.5 bg-fairway hover:bg-fairway-dark"
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save Handicap'}
          </Button>
        </div>

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
