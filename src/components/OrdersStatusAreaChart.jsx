import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { adminApi } from "../api/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Chart status labels and colors
const chartConfig = {
  pending: { label: "Pending", color: "var(--chart-1)" },
  confirmed: { label: "Confirmed", color: "var(--chart-2)" },
  shipped: { label: "Shipped", color: "var(--chart-3)" },
  delivered: { label: "Delivered", color: "var(--chart-4)" },
  cancelled: { label: "Cancelled", color: "var(--chart-5)" },
};

export default function OrdersStatusAreaChart() {
  const [timeRange, setTimeRange] = useState("30");
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch chart data from backend
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await adminApi.get(`/orders/stats/${timeRange}`);
      setOrderData(res.data || []);
    } catch (err) {
      console.error("Failed to load chart data", err);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Loading state
  if (loading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Loading chart data...
      </p>
    );
  }

  // Empty state
  if (!orderData.length) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No order statistics available
      </p>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b">
        <div>
          <CardTitle>Order Status Overview</CardTitle>
          <CardDescription>
            Orders grouped by status for selected period
          </CardDescription>
        </div>

        {/* Time Range Filter */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pt-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={orderData}>
            <CartesianGrid vertical={false} />

            {/* X-Axis Date Labels */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />

            {/* Order Status Areas */}
            <Area
              dataKey="pending"
              type="natural"
              stackId="a"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.6}
            />

            <Area
              dataKey="confirmed"
              type="natural"
              stackId="a"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.6}
            />

            <Area
              dataKey="shipped"
              type="natural"
              stackId="a"
              stroke="var(--chart-3)"
              fill="var(--chart-3)"
              fillOpacity={0.6}
            />

            <Area
              dataKey="delivered"
              type="natural"
              stackId="a"
              stroke="var(--chart-4)"
              fill="var(--chart-4)"
              fillOpacity={0.6}
            />

            <Area
              dataKey="cancelled"
              type="natural"
              stackId="a"
              stroke="var(--chart-5)"
              fill="var(--chart-5)"
              fillOpacity={0.6}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

