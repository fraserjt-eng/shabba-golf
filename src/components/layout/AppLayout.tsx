import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      <main className="flex-1 pt-[calc(2rem+3rem)] pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
