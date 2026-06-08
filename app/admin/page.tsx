import { fetchAnalyticsOrders, fetchDashboardRecent } from '@/lib/sanity/queries'
import { buildChartData, buildDashboardMetrics, type DashboardPeriodView } from '@/lib/dashboard-analytics'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

type Props = {
  searchParams: Promise<{ view?: string }>
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const { view: viewParam } = await searchParams
  const view: DashboardPeriodView = viewParam === 'yearly' ? 'yearly' : 'monthly'

  const [analyticsOrders, recent] = await Promise.all([
    fetchAnalyticsOrders(),
    fetchDashboardRecent(),
  ])

  const metrics = buildDashboardMetrics(analyticsOrders, view)
  const chartData = buildChartData(analyticsOrders, view)

  return (
    <AdminDashboard
      view={view}
      metrics={metrics}
      chartData={chartData}
      recentOrders={recent.recentOrders}
      recentCustomOrders={recent.recentCustomOrders}
    />
  )
}
