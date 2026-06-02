'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, ShoppingBag, Sparkles, CalendarDays, CalendarRange } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'
import type { ChartPoint, DashboardMetrics, DashboardPeriodView } from '@/lib/dashboard-analytics'

const DashboardCharts = dynamic(
  () => import('@/components/admin/dashboard-charts').then((m) => m.DashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-[300px] animate-pulse border-0 bg-muted/30" />
        <Card className="h-[300px] animate-pulse border-0 bg-muted/30" />
      </div>
    ),
  },
)

type Props = {
  view: DashboardPeriodView
  metrics: DashboardMetrics
  chartData: ChartPoint[]
  recentOrders: Array<{ _id: string; _createdAt: string; customerName: string; total: number; status: string }>
  recentCustomOrders: Array<{
    _id: string
    _createdAt: string
    customerName: string
    productType: string
    status: string
    total?: number
  }>
}

function PeriodToggle({ view }: { view: DashboardPeriodView }) {
  const router = useRouter()

  const setView = (next: DashboardPeriodView) => {
    router.push(next === 'yearly' ? '/admin?view=yearly' : '/admin')
  }

  return (
    <div className="inline-flex rounded-xl border border-border/80 bg-muted/30 p-1 shadow-inner">
      <button
        type="button"
        onClick={() => setView('monthly')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4',
          view === 'monthly'
            ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <CalendarDays className="h-4 w-4" />
        Monthly
      </button>
      <button
        type="button"
        onClick={() => setView('yearly')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4',
          view === 'yearly'
            ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <CalendarRange className="h-4 w-4" />
        Yearly
      </button>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'gold',
}: {
  title: string
  value: string
  subtitle?: string
  icon: typeof TrendingUp
  accent?: 'gold' | 'primary' | 'chocolate'
}) {
  const accentBg = {
    gold: 'bg-gold/15 text-gold ring-gold/20',
    primary: 'bg-primary/15 text-primary ring-primary/20',
    chocolate: 'bg-chocolate/10 text-chocolate ring-chocolate/15',
  }[accent]

  return (
    <Card className="relative overflow-hidden border-0 bg-card shadow-md shadow-chocolate/5 ring-1 ring-border/50 transition-shadow hover:shadow-lg">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-gold/10 blur-2xl" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-4 sm:p-5">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl ring-1', accentBg)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <p className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {subtitle && <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export function AdminDashboard({
  view,
  metrics,
  chartData,
  recentOrders,
  recentCustomOrders,
}: Props) {
  const periodRevenueTitle = view === 'yearly' ? 'Yearly revenue' : 'Monthly revenue'

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          title="Dashboard"
          description={metrics.periodLabel}
          className="flex-1"
        />
        <PeriodToggle view={view} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total revenue"
          value={`${metrics.totalRevenue.toLocaleString()} ETB`}
          subtitle="All-time delivered (menu + custom)"
          icon={TrendingUp}
          accent="gold"
        />
        <StatCard
          title={periodRevenueTitle}
          value={`${metrics.periodRevenue.toLocaleString()} ETB`}
          subtitle={metrics.periodRevenueLabel}
          icon={CalendarDays}
          accent="primary"
        />
        <StatCard
          title="Total orders"
          value={String(metrics.totalOrders)}
          subtitle={view === 'yearly' ? 'Placed in current year' : 'Placed in current month'}
          icon={ShoppingBag}
          accent="chocolate"
        />
        <StatCard
          title="Custom orders"
          value={String(metrics.customOrders)}
          subtitle={view === 'yearly' ? 'Custom requests in current year' : 'Custom requests in current month'}
          icon={Sparkles}
          accent="primary"
        />
      </div>

      <DashboardCharts data={chartData} view={view} periodLabel={metrics.periodLabel} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md ring-1 ring-border/50">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 bg-muted/20 p-4 sm:p-6">
            <CardTitle className="font-serif text-lg">Recent menu orders</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-full" asChild>
              <Link href="/admin/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {recentOrders.length ? (
              <ResponsiveTableWrap>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>
                          {order.status === 'delivered' && order.total != null
                            ? `${order.total.toLocaleString()} ETB`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableWrap>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md ring-1 ring-border/50">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 bg-muted/20 p-4 sm:p-6">
            <CardTitle className="font-serif text-lg">Recent custom orders</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-full" asChild>
              <Link href="/admin/custom-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {recentCustomOrders.length ? (
              <ResponsiveTableWrap>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCustomOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell className="max-w-[8rem] truncate">{order.productType}</TableCell>
                        <TableCell>
                          {order.status === 'delivered' && order.total != null
                            ? `${order.total.toLocaleString()} ETB`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResponsiveTableWrap>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">No custom orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
