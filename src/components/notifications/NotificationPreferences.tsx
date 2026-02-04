import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'

interface Preference {
  key: string
  label: string
  description: string
}

const preferences: Preference[] = [
  { key: 'round_reminders', label: 'Round Reminders', description: 'Get notified about upcoming rounds' },
  { key: 'player_updates', label: 'Player Updates', description: 'When players join or leave rounds' },
  { key: 'settlement_reminders', label: 'Settlement Reminders', description: 'Reminders about pending payments' },
  { key: 'backout_alerts', label: 'Backout Alerts', description: 'When players back out of rounds' },
]

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    round_reminders: true,
    player_updates: true,
    settlement_reminders: true,
    backout_alerts: true,
  })

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-fairway" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <button
              role="switch"
              aria-checked={enabled[pref.key]}
              onClick={() => toggle(pref.key)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                enabled[pref.key] ? 'bg-fairway' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  enabled[pref.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
