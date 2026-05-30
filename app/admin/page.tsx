import { fetchDashboardStats, fetchMonthOrdersForCharts } from '@/lib/sanity/queries'
import { buildMonthlyChartData, getMonthLabel } from '@/lib/dashboard-monthly'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  const [stats, monthOrders] = await Promise.all([
    fetchDashboardStats(),
    fetchMonthOrdersForCharts(),
  ])

  const chartData = buildMonthlyChartData(monthOrders)
  const monthLabel = getMonthLabel()

  return (
    <AdminDashboard
      stats={stats}
      chartData={chartData}
      monthLabel={monthLabel}
    />
  )
}
