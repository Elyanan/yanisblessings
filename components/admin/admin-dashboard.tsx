'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'
import type { MonthlyChartPoint } from '@/lib/dashboard-monthly'

const MonthlyCharts = dynamic(
  () => import('@/components/admin/monthly-charts').then((m) => m.MonthlyCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-[260px] sm:h-[360px] animate-pulse bg-muted/30" />
        <Card className="h-[260px] sm:h-[360px] animate-pulse bg-muted/30" />
      </div>
    ),
  },
)

type DashboardStats = {
  totalOrders: number
  totalRevenue: number
  totalItemsOrdered: number
  recentOrders: Array<{ _id: string; _createdAt: string; customerName: string; total: number; status: string }>
  customOrderCount: number
  recentCustomOrders: Array<{ _id: string; _createdAt: string; customerName: string; productType: string; status: string }>
}

type Props = {
  stats: DashboardStats
  chartData: MonthlyChartPoint[]
  monthLabel: string
}

function RecentOrderCards({
  orders,
}: {
  orders: Array<{ _id: string; customerName: string; total: number; status: string }>
}) {
  return (
    <ul className="space-y-3 md:hidden">
      {orders.map((order) => (
        <li
          key={order._id}
          className="rounded-xl border border-border bg-muted/20 p-3 flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.total?.toLocaleString()} ETB</p>
          </div>
          <Badge variant="secondary" className="shrink-0 capitalize">
            {order.status}
          </Badge>
        </li>
      ))}
    </ul>
  )
}

function RecentCustomOrderCards({
  orders,
}: {
  orders: Array<{ _id: string; customerName: string; productType: string; status: string }>
}) {
  return (
    <ul className="space-y-3 md:hidden">
      {orders.map((order) => (
        <li key={order._id} className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-foreground truncate">{order.customerName}</p>
            <Badge variant="secondary" className="shrink-0 capitalize">
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{order.productType}</p>
        </li>
      ))}
    </ul>
  )
}

export function AdminDashboard({ stats, chartData, monthLabel }: Props) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description={`Overview of orders and revenue for ${monthLabel}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-3xl font-bold leading-tight">
              {(stats.totalRevenue ?? 0).toLocaleString()}{' '}
              <span className="text-base sm:text-3xl">ETB</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Custom Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{stats.customOrderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium leading-snug">Items Ordered</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalItemsOrdered ?? 0}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Menu order units</p>
          </CardContent>
        </Card>
      </div>

      <MonthlyCharts data={chartData} monthLabel={monthLabel} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
              <Link href="/admin/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {stats.recentOrders?.length ? (
              <>
                <RecentOrderCards orders={stats.recentOrders} />
                <div className="hidden md:block">
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
                        {stats.recentOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.total?.toLocaleString()} ETB</TableCell>
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
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Recent Custom Orders</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
              <Link href="/admin/custom-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {stats.recentCustomOrders?.length ? (
              <>
                <RecentCustomOrderCards orders={stats.recentCustomOrders} />
                <div className="hidden md:block">
                  <ResponsiveTableWrap>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.recentCustomOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.productType}</TableCell>
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
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No custom orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
