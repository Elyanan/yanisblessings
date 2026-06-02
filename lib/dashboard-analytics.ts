export type DashboardPeriodView = 'monthly' | 'yearly'

export type AnalyticsOrder = {
  _createdAt: string
  total?: number
  status: string
  _type?: 'order' | 'customOrder'
}

export type ChartPoint = {
  key: string
  label: string
  revenue: number
  orders: number
}

export type DashboardMetrics = {
  totalRevenue: number
  periodRevenue: number
  periodRevenueLabel: string
  totalOrders: number
  customOrders: number
  periodLabel: string
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function isDelivered(order: AnalyticsOrder) {
  return order.status === 'delivered'
}

function inYear(date: Date, year: number) {
  return date.getFullYear() === year
}

function inMonth(date: Date, year: number, month: number) {
  return date.getFullYear() === year && date.getMonth() === month
}

export function buildDashboardMetrics(
  orders: AnalyticsOrder[],
  view: DashboardPeriodView,
  referenceDate = new Date(),
): DashboardMetrics {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()

  const menuOrders = orders.filter((o) => o._type !== 'customOrder')
  const customOrders = orders.filter((o) => o._type === 'customOrder')

  const allDelivered = orders.filter(isDelivered)
  const totalRevenue = allDelivered.reduce((sum, o) => sum + (o.total ?? 0), 0)

  if (view === 'yearly') {
    const yearDelivered = allDelivered.filter((o) => inYear(new Date(o._createdAt), year))
    const yearOrders = orders.filter((o) => inYear(new Date(o._createdAt), year))
    const yearCustom = customOrders.filter((o) => inYear(new Date(o._createdAt), year))

    return {
      totalRevenue,
      periodRevenue: yearDelivered.reduce((sum, o) => sum + (o.total ?? 0), 0),
      periodRevenueLabel: `${year} revenue`,
      totalOrders: yearOrders.length,
      customOrders: yearCustom.length,
      periodLabel: `Calendar year ${year}`,
    }
  }

  const monthDelivered = allDelivered.filter((o) => inMonth(new Date(o._createdAt), year, month))
  const monthOrders = orders.filter((o) => inMonth(new Date(o._createdAt), year, month))
  const monthCustom = customOrders.filter((o) => inMonth(new Date(o._createdAt), year, month))

  return {
    totalRevenue,
    periodRevenue: monthDelivered.reduce((sum, o) => sum + (o.total ?? 0), 0),
    periodRevenueLabel: 'This month',
    totalOrders: monthOrders.length,
    customOrders: monthCustom.length,
    periodLabel: referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  }
}

export function buildChartData(
  orders: AnalyticsOrder[],
  view: DashboardPeriodView,
  referenceDate = new Date(),
): ChartPoint[] {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()

  if (view === 'monthly') {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1
      const inDayOrders = orders.filter((o) => {
        const created = new Date(o._createdAt)
        return inMonth(created, year, month) && created.getDate() === day
      })
      const delivered = inDayOrders.filter(isDelivered)
      return {
        key: `${year}-${month}-${day}`,
        label: String(day),
        revenue: delivered.reduce((sum, o) => sum + (o.total ?? 0), 0),
        orders: inDayOrders.length,
      }
    })
  }

  return MONTH_NAMES.map((label, monthIndex) => {
    const inMonthOrders = orders.filter((o) => inMonth(new Date(o._createdAt), year, monthIndex))
    const delivered = inMonthOrders.filter(isDelivered)
    return {
      key: `${year}-${monthIndex}`,
      label,
      revenue: delivered.reduce((sum, o) => sum + (o.total ?? 0), 0),
      orders: inMonthOrders.length,
    }
  })
}
