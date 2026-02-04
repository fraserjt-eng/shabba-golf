import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function AddMatchButton() {
  return (
    <Button
      variant="outline"
      className="w-full h-11 border-dashed text-muted-foreground"
      onClick={() => alert('Game creation coming in Phase 2!')}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Game
    </Button>
  )
}
