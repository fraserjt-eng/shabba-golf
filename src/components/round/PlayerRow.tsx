import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import type { User } from '@/types'

interface PlayerRowProps {
  user: User
  isCurrentUser: boolean
  isCore: boolean
  className?: string
}

export function PlayerRow({ user, isCurrentUser, isCore, className }: PlayerRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors',
        isCurrentUser && 'bg-fairway/5',
        className,
      )}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.avatar_url ?? undefined} alt={user.display_name} />
        <AvatarFallback
          style={{ backgroundColor: getAvatarColor(user.display_name) }}
          className="text-white text-xs font-medium"
        >
          {getInitials(user.display_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-medium truncate', isCurrentUser && 'text-fairway')}>
            {user.display_name}
            {isCurrentUser && <span className="text-muted-foreground font-normal"> (You)</span>}
          </span>
        </div>
        {user.handicap != null && (
          <span className="text-xs text-muted-foreground">
            {user.handicap} HCP
          </span>
        )}
      </div>

      <Badge variant={isCore ? 'default' : 'secondary'} className="text-[10px] shrink-0">
        {isCore ? 'Core' : 'Sub'}
      </Badge>
    </div>
  )
}
