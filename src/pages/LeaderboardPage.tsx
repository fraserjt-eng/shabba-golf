import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { Trophy } from 'lucide-react'

export function LeaderboardPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <ScrollFadeIn>
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-foreground">
            Leaderboard
          </h2>
          <p className="text-muted-foreground">
            Season rankings and standings.
          </p>
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-trophy" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-12">
              Play some rounds to see the leaderboard!
            </p>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Net winnings section */}
      <ScrollFadeIn delay={200}>
        <div className="bg-surface-green rounded-xl p-6">
          <h3 className="text-lg font-light text-dark-green mb-4">Net Winnings</h3>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No games settled yet.
            </p>
          </div>
        </div>
      </ScrollFadeIn>
    </div>
  )
}
