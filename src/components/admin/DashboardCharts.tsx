'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChartDataPoint {
    date: string;
    revenue: number;
    orders: number;
}

interface DashboardChartsProps {
    data: ChartDataPoint[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    const [view, setView] = useState<'revenue' | 'orders'>('revenue');

    if (data.length === 0) {
        return (
            <div className="flex h-[350px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                No data available for the last 30 days.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button 
                    variant={view === 'revenue' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView('revenue')}
                >
                    Revenue
                </Button>
                <Button 
                    variant={view === 'orders' ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView('orders')}
                >
                    Orders
                </Button>
            </div>
            
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={view === 'revenue' ? "var(--color-primary)" : "#10b981"} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={view === 'revenue' ? "var(--color-primary)" : "#10b981"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="date" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => view === 'revenue' ? `$${value}` : value.toString()}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-md">
                                            <p className="font-medium">{label}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: view === 'revenue' ? "var(--color-primary)" : "#10b981" }}
                                                />
                                                <span className="font-bold">
                                                    {view === 'revenue' 
                                                        ? formatCurrency(payload[0].value as number) 
                                                        : `${payload[0].value} orders`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={view}
                            stroke={view === 'revenue' ? "var(--color-primary)" : "#10b981"}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
