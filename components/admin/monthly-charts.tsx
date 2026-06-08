'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { MonthlyChartPoint } from '@/lib/dashboard-monthly'

const revenueConfig = {
  revenue: {
    label: 'Revenue',
    color: '#C58A3A',
  },
} satisfies ChartConfig

const ordersConfig = {
  orders: {
    label: 'Orders',
    color: '#E9A8A6',
  },
} satisfies ChartConfig

type Props = {
  data: MonthlyChartPoint[]
  monthLabel: string
}

export function MonthlyCharts({ data, monthLabel }: Props) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0)

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="font-serif text-lg sm:text-xl">Revenue</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {monthLabel} · {totalRevenue.toLocaleString()} ETB total
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-2 sm:px-6">
          <ChartContainer config={revenueConfig} className="h-[220px] w-full sm:h-[280px]">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={36}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const day = payload?.[0]?.payload?.day
                      return day ? `Day ${day}` : ''
                    }}
                    formatter={(value) => [`${Number(value).toLocaleString()} ETB`, ' Revenue']}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="font-serif text-lg sm:text-xl">Orders</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {monthLabel} · {totalOrders} order{totalOrders === 1 ? '' : 's'} placed
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-2 sm:px-6">
          <ChartContainer config={ordersConfig} className="h-[220px] w-full sm:h-[280px]">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-orders)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-orders)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={28}
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const day = payload?.[0]?.payload?.day
                      return day ? `Day ${day}` : ''
                    }}
                    formatter={(value) => [String(value), ' Orders']}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="var(--color-orders)"
                strokeWidth={2.5}
                fill="url(#ordersGradient)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
