import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SettlementList } from '@/components/games/SettlementList'
import { demoSettlements, getDemoUserName, CURRENT_USER_ID } from '@/lib/demo-data'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, CheckCircle, Clock } from 'lucide-react'

export function SettlementsPage() {
  const pendingSettlements = useMemo(
    () => demoSettlements.filter((s) => s.status === 'pending'),
    [],
  )

  const settledSettlements = useMemo(
    () => demoSettlements.filter((s) => s.status === 'paid'),
    [],
  )

  // Calculate net balance for current user
  const netBalance = useMemo(() => {
    let balance = 0
    for (const s of demoSettlements) {
      if (s.status === 'disputed' || s.status === 'forgiven') continue
      if (s.to_user_id === CURRENT_USER_ID) {
        balance += s.amount
      }
      if (s.from_user_id === CURRENT_USER_ID) {
        balance -= s.amount
      }
    }
    return balance
  }, [])

  const balanceIsPositive = netBalance >= 0

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-foreground">Settlements</h2>
        <p className="text-muted-foreground">Track who owes what.</p>
      </div>

      {/* Net Balance Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-trophy" />
              <span className="text-sm font-medium text-muted-foreground">
                Your Net Balance
              </span>
            </div>
            <span
              className={`font-stats text-lg font-semibold ${
                balanceIsPositive ? 'text-fairway' : 'text-penalty'
              }`}
            >
              {balanceIsPositive ? '+' : ''}
              {formatCurrency(netBalance)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Settlements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-trophy" />
            Pending
            {pendingSettlements.length > 0 && (
              <Badge className="bg-trophy/10 text-trophy border-trophy/20 text-[10px] ml-1">
                {pendingSettlements.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettlementList
            settlements={pendingSettlements}
            getUserName={getDemoUserName}
          />
        </CardContent>
      </Card>

      {/* Settled */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-fairway" />
            Settled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettlementList
            settlements={settledSettlements}
            getUserName={getDemoUserName}
          />
        </CardContent>
      </Card>
    </div>
  )
}
