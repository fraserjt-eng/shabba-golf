/**
 * Calculate course handicap from handicap index and course data.
 * Formula: Course Handicap = Handicap Index × (Slope Rating / 113) + (Course Rating - Par)
 */
export function calculateCourseHandicap(
  handicapIndex: number,
  slopeRating: number,
  courseRating: number,
  par: number,
): number {
  const courseHC = handicapIndex * (slopeRating / 113) + (courseRating - par)
  return Math.round(courseHC)
}

/**
 * Calculate strokes given between two players at a specific course.
 * Returns positive number = playerA gets strokes, negative = playerB gets strokes.
 */
export function calculateStrokesGiven(
  playerAIndex: number,
  playerBIndex: number,
  slopeRating: number,
  courseRating: number,
  par: number,
): { strokesGiven: number; higherHandicapPlayer: 'A' | 'B' } {
  const courseHcA = calculateCourseHandicap(playerAIndex, slopeRating, courseRating, par)
  const courseHcB = calculateCourseHandicap(playerBIndex, slopeRating, courseRating, par)
  const diff = courseHcA - courseHcB

  return {
    strokesGiven: Math.abs(diff),
    higherHandicapPlayer: diff >= 0 ? 'A' : 'B',
  }
}

/**
 * Look up GHIN handicap index by GHIN number.
 * In demo mode, returns mock data. In production, would call the GHIN API.
 */
export async function lookupGhinHandicap(ghinNumber: string): Promise<{
  handicapIndex: number
  lastUpdated: string
  playerName: string
} | null> {
  // Demo mode: return mock data based on GHIN number
  const mockData: Record<string, { handicapIndex: number; playerName: string }> = {
    '1234567': { handicapIndex: 12.4, playerName: 'Jake Fraser' },
    '2345678': { handicapIndex: 8.2, playerName: 'Mike Sullivan' },
    '3456789': { handicapIndex: 15.1, playerName: 'Chris Daniels' },
    '4567890': { handicapIndex: 10.5, playerName: 'Tommy Park' },
    '5678901': { handicapIndex: 18.3, playerName: 'Ryan Bennett' },
    '6789012': { handicapIndex: 5.8, playerName: 'Dave Kowalski' },
    '7890123': { handicapIndex: 14.0, playerName: 'Nick Alvarez' },
    '8901234': { handicapIndex: 20.7, playerName: 'Brian Walsh' },
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const data = mockData[ghinNumber]
  if (!data) return null

  return {
    handicapIndex: data.handicapIndex,
    lastUpdated: new Date().toISOString(),
    playerName: data.playerName,
  }
}
