import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { useUserStore, useTeamStore } from '@/stores'

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
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AppInitializer>
    </BrowserRouter>
  )
}

export default App
