import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { Calendar, Users, DollarSign } from 'lucide-react'

export function HomePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome section */}
      <ScrollFadeIn>
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-foreground">
            Welcome to <span className="font-semibold text-fairway">Golf Squad</span>
          </h2>
          <p className="text-muted-foreground">
            Organize rounds, track games, settle up.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Quick actions */}
      <ScrollFadeIn delay={100}>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex-col h-auto py-4 gap-2">
            <Calendar className="h-5 w-5 text-fairway" />
            <span className="text-xs">Schedule</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4 gap-2">
            <Users className="h-5 w-5 text-sky" />
            <span className="text-xs">Invite</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4 gap-2">
            <DollarSign className="h-5 w-5 text-trophy" />
            <span className="text-xs">Settle</span>
          </Button>
        </div>
      </ScrollFadeIn>

      {/* Upcoming rounds placeholder */}
      <ScrollFadeIn delay={200}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Rounds</CardTitle>
              <Badge variant="secondary">0 rounds</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No upcoming rounds. Create a team and schedule your first round!
            </p>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Stats preview */}
      <ScrollFadeIn delay={300}>
        <div className="bg-dark-green rounded-xl p-6 text-white">
          <h3 className="text-lg font-light mb-4">Season Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-stats text-2xl font-semibold">0</div>
              <div className="text-xs text-white/70 mt-1">Rounds</div>
            </div>
            <div className="text-center">
              <div className="font-stats text-2xl font-semibold">—</div>
              <div className="text-xs text-white/70 mt-1">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="font-stats text-2xl font-semibold text-trophy">$0</div>
              <div className="text-xs text-white/70 mt-1">Winnings</div>
            </div>
          </div>
        </div>
      </ScrollFadeIn>
    </div>
  )
}
