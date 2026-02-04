import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const currentUser = useUserStore((s) => s.currentUser)

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
