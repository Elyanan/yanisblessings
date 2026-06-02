'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { ChartPoint, DashboardPeriodView } from '@/lib/dashboard-analytics'

const revenueConfig = {
  revenue: {
    label: 'Revenue',
    color: '#C58A3A',
  },
} satisfies ChartConfig

const ordersConfig = {
  orders: {
    label: 'Orders',
    color: '#B85C5A',
  },
} satisfies ChartConfig

type Props = {
  data: ChartPoint[]
  view: DashboardPeriodView
  periodLabel: string
}

export function DashboardCharts({ data, view, periodLabel }: Props) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0)
  const revenueSubtitle =
    view === 'yearly'
      ? `Delivered revenue by month · ${periodLabel}`
      : `Delivered revenue by day · ${periodLabel}`

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden border-0 bg-card shadow-lg shadow-chocolate/5 ring-1 ring-border/60">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-beige/40 to-transparent pb-4 p-4 sm:p-6">
          <CardTitle className="font-serif text-lg sm:text-xl">Revenue</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{revenueSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-1 sm:px-4 pt-4">
          <ChartContainer config={revenueConfig} className="h-[240px] w-full sm:h-[300px]">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={44}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => (view === 'yearly' ? String(label) : `Day ${label}`)}
                    formatter={(value) => [`${Number(value).toLocaleString()} ETB`, ' Revenue']}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                fill="url(#dashboardRevenueGradient)"
                dot={{ r: 3, fill: 'var(--color-revenue)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 bg-card shadow-lg shadow-chocolate/5 ring-1 ring-border/60">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent pb-4 p-4 sm:p-6">
          <CardTitle className="font-serif text-lg sm:text-xl">Orders</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {view === 'yearly' ? 'Orders placed by month' : 'Orders placed by day'} · {totalOrders}{' '}
            in chart
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-1 sm:px-4 pt-4">
          <ChartContainer config={ordersConfig} className="h-[240px] w-full sm:h-[300px]">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-orders)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-orders)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={32}
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => (view === 'yearly' ? String(label) : `Day ${label}`)}
                    formatter={(value) => [String(value), ' Orders']}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="var(--color-orders)"
                strokeWidth={2.5}
                fill="url(#dashboardOrdersGradient)"
                dot={{ r: 3, fill: 'var(--color-orders)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
