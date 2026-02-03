import { TeamSwitcher } from './TeamSwitcher'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Green accent bar */}
      <div className="bg-fairway text-white text-sm py-1 px-4 flex items-center justify-between">
        <span className="font-medium tracking-wide">Golf Squad</span>
        <span className="text-white/70 text-xs">⛳ Game On</span>
      </div>
      {/* Main header */}
      <div className="bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-12">
          <h1 className="text-lg font-semibold text-foreground">
            Golf Squad
          </h1>
          <TeamSwitcher />
        </div>
      </div>
    </header>
  )
}
