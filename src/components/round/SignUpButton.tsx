import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserPlus, Check } from 'lucide-react'

interface SignUpButtonProps {
  onSignUp: () => void
  disabled?: boolean
}

export function SignUpButton({ onSignUp, disabled }: SignUpButtonProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleClick = () => {
    if (confirmed) return
    onSignUp()
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 2000)
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || confirmed}
      className={cn(
        'w-full h-12 text-base font-medium transition-all',
        confirmed && 'bg-fairway/20 text-fairway border-fairway',
      )}
      size="lg"
    >
      {confirmed ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Signed Up!
        </>
      ) : (
        <>
          <UserPlus className="h-5 w-5 mr-2" />
          Sign Me Up
        </>
      )}
    </Button>
  )
}
