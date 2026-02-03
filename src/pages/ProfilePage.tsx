import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { Settings, LogOut } from 'lucide-react'

export function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <ScrollFadeIn>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-fairway text-white text-xl font-semibold">
                  GS
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Golfer</h2>
                <p className="text-sm text-muted-foreground">Sign in to see your profile</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      <ScrollFadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Handicap</span>
              <span className="font-stats font-medium">—</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rounds Played</span>
              <span className="font-stats font-medium">0</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-stats font-medium">—</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net Winnings</span>
              <span className="font-stats font-medium text-fairway">$0</span>
            </div>
          </CardContent>
        </Card>
      </ScrollFadeIn>

      <ScrollFadeIn delay={200}>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-penalty">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </ScrollFadeIn>
    </div>
  )
}
