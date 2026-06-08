export type MonthlyChartPoint = {
  day: number
  label: string
  revenue: number
  orders: number
}

export type OrderForChart = {
  _createdAt: string
  total?: number
  status?: string
}

export function getMonthLabel(date = new Date()): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function buildMonthlyChartData(
  orders: OrderForChart[],
  referenceDate = new Date(),
): MonthlyChartPoint[] {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const points: MonthlyChartPoint[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    return {
      day,
      label: String(day),
      revenue: 0,
      orders: 0,
    }
  })

  for (const order of orders) {
    const created = new Date(order._createdAt)
    if (created.getFullYear() !== year || created.getMonth() !== month) continue

    const index = created.getDate() - 1
    if (index < 0 || index >= points.length) continue

    points[index].orders += 1
    if (order.status === 'delivered') {
      points[index].revenue += order.total ?? 0
    }
  }

  return points
}
