'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MonthlyChartPoint } from '@/lib/dashboard-monthly'

const MonthlyCharts = dynamic(
  () => import('@/components/admin/monthly-charts').then((m) => m.MonthlyCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="h-[360px] animate-pulse bg-muted/30" />
        <Card className="h-[360px] animate-pulse bg-muted/30" />
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

export function AdminDashboard({ stats, chartData, monthLabel }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of orders and revenue for {monthLabel}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalOrders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{(stats.totalRevenue ?? 0).toLocaleString()} ETB</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Custom Orders</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.customOrderCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Items Ordered</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalItemsOrdered ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Units across menu orders</p>
          </CardContent>
        </Card>
      </div>

      <MonthlyCharts data={chartData} monthLabel={monthLabel} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentOrders?.length ? (
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
                      <TableCell><Badge variant="secondary">{order.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Custom Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/custom-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentCustomOrders?.length ? (
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
                      <TableCell><Badge variant="secondary">{order.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">No custom orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
