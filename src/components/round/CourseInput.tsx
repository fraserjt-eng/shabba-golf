import { Input } from '@/components/ui/input'

interface CourseInputProps {
  courseName: string
  slopeRating: string
  courseRating: string
  par: string
  onCourseNameChange: (value: string) => void
  onSlopeRatingChange: (value: string) => void
  onCourseRatingChange: (value: string) => void
  onParChange: (value: string) => void
}

export function CourseInput({
  courseName,
  slopeRating,
  courseRating,
  par,
  onCourseNameChange,
  onSlopeRatingChange,
  onCourseRatingChange,
  onParChange,
}: CourseInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Course Name</label>
        <Input
          placeholder="e.g., Pine Valley Golf Club"
          value={courseName}
          onChange={(e) => onCourseNameChange(e.target.value)}
          className="h-11"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Slope Rating</label>
          <Input
            type="number"
            placeholder="113"
            value={slopeRating}
            onChange={(e) => onSlopeRatingChange(e.target.value)}
            className="h-10"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Course Rating</label>
          <Input
            type="number"
            step="0.1"
            placeholder="72.0"
            value={courseRating}
            onChange={(e) => onCourseRatingChange(e.target.value)}
            className="h-10"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Par</label>
          <Input
            type="number"
            placeholder="72"
            value={par}
            onChange={(e) => onParChange(e.target.value)}
            className="h-10"
          />
        </div>
      </div>
    </div>
  )
}
