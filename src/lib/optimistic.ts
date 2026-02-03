export async function optimisticUpdate<T>(
  getCurrentState: () => T,
  applyOptimistic: () => void,
  asyncOperation: () => Promise<void>,
  rollback: (snapshot: T) => void,
): Promise<void> {
  const snapshot = getCurrentState()
  applyOptimistic()

  try {
    await asyncOperation()
  } catch (error) {
    rollback(snapshot)
    throw error
  }
}
