import { cn } from '@/lib/utils'

interface SpotsIndicatorProps {
  filled: number
  total: number
  className?: string
}

export function SpotsIndicator({ filled, total, className }: SpotsIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'w-3 h-3 rounded-full transition-colors',
            i < filled
              ? 'bg-fairway'
              : 'bg-gray-200 border border-gray-300',
          )}
        />
      ))}
    </div>
  )
}
