"use client"

// imports
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// description
export const description = "A donut chart with an active sector"

// data
const chartData = [
  { persona: "Sim Racers", audience: 275, fill: "#352d8f" },
  { persona: "Weekend Golfers", audience: 200, fill: "#A4E0EA" },
  { persona: "Athletes", audience: 187, fill: "#506EC1" },
  { persona: "Tech Enthusiasts", audience: 173, fill: "#54AEC8" },
  { browser: "other", visitors: 90, fill: "#EBEBEB" },
]

// config: This is what it does: 
// 1. It defines the labels for the chart
// 2. It defines the colors for the chart
// 3. It defines the data for the chart
// 4. It defines the configuration for the chart
// 5. It defines the data for the chart
// 6. It defines the configuration for the chart
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#352d8f",
  },
  safari: {
    label: "Safari",
    color: "#A4E0EA",
  },
  firefox: {
    label: "Firefox",
    color: "#506EC1",
  },
  edge: {
    label: "Edge",
    color: "#54AEC8",
  },
  other: {
    label: "Other",
    color: "#EBEBEB",
  },
} satisfies ChartConfig // This is a type assertion that tells TypeScript that the chartConfig object satisfies the ChartConfig type

// component
export function PersonaChart() {
  return (
    <Card className="flex flex-col border-none">

        {/* Header */}
      <CardHeader className="items-center pb-0">
        {/* <CardTitle>Pie Chart - Donut Active</CardTitle>
        <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 pb-0 border-none">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="audience"
              nameKey="persona"
              innerRadius={225}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 40} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}

    </Card>
  )
}
