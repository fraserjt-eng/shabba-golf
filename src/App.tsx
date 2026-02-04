import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Spinner } from '@/components/ui/spinner'
import { useUserStore, useTeamStore } from '@/stores'

// Lazy load route pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const RoundDetailPage = lazy(() => import('@/pages/RoundDetailPage').then((m) => ({ default: m.RoundDetailPage })))
const RoundHistoryPage = lazy(() => import('@/pages/RoundHistoryPage').then((m) => ({ default: m.RoundHistoryPage })))
const SettlementsPage = lazy(() => import('@/pages/SettlementsPage').then((m) => ({ default: m.SettlementsPage })))
const TeamSettingsPage = lazy(() => import('@/pages/TeamSettingsPage').then((m) => ({ default: m.TeamSettingsPage })))
const MemberProfilePage = lazy(() => import('@/pages/MemberProfilePage').then((m) => ({ default: m.MemberProfilePage })))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner />
    </div>
  )
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useUserStore((s) => s.fetchCurrentUser)
  const fetchTeams = useTeamStore((s) => s.fetchTeams)

  useEffect(() => {
    fetchCurrentUser()
    fetchTeams()
  }, [fetchCurrentUser, fetchTeams])

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/round/:id" element={<RoundDetailPage />} />
              <Route path="/rounds" element={<RoundHistoryPage />} />
              <Route path="/settlements" element={<SettlementsPage />} />
              <Route path="/team/settings" element={<TeamSettingsPage />} />
              <Route path="/member/:id" element={<MemberProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </AppInitializer>
    </BrowserRouter>
  )
}

export default App
