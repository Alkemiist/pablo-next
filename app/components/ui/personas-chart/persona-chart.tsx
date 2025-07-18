"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { personaChartInfo } from "@/lib/persona-chart-info";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const description = "An interactive pie chart"

// This is the data being mapped to the chart - looping through the personas and mapping the name, value, and color to the chart
const personaData = personaChartInfo.personas.map((persona) => ({
  name: persona.name,
  percentage: persona.percentage,
  fill: persona.color,
}))

// Chart Config: This is the configuration for the chart - mapping the name, value, and color to the chart
const chartConfig = {
  
  "sim-racers": {
    label: "Sim Racers",
    color: "#352D8F",
  },
  "tech-enthusiasts": {
    label: "Tech Enthusiasts", 
    color: "#EBEBEB",
  },
  "weekend-golfers": {
    label: "Weekend Golfers",
    color: "#A4E0EA",
  },
  "weekend-athletes": {
    label: "Weekend Athletes",
    color: "#54AEC8",
  },
  "the-generics": {
    label: "The Generics",
    color: "#506EC1",
  },
} satisfies ChartConfig

// Define the props interface for the component - activePersona and setActivePersona
interface PersonaChartProps {
  activePersona: string;
  setActivePersona: (persona: string) => void;
}

// This is the component that renders the chart - the pie chart
export function PersonaChart({ activePersona, setActivePersona }: PersonaChartProps) {

  const id = "pie-interactive"

  const activeIndex = React.useMemo(
    () => personaData.findIndex((item) => item.name === activePersona),
    [activePersona]
  )
  const personaNames = React.useMemo(() => personaData.map((item) => item.name), [])

  return (

    <Card data-chart={id} className="flex flex-col h-full w-full border-none">
      <ChartStyle id={id} config={chartConfig} />

      {/* Header */}
      <CardHeader className="flex items-start space-y-0 pb-4 flex-shrink-0">

        {/* Title */}
        <div className="grid gap-1">
          <CardTitle className="">Persona Chart</CardTitle>
          <CardDescription className="text-slate-500">Select a persona to view their data</CardDescription>
        </div>

        {/* Select Persona Trigger */}
        <Select value={activePersona} onValueChange={setActivePersona}>
          <SelectTrigger
            className="ml-auto h-8 w-auto min-w-[140px] rounded-lg pl-2.5 border border-slate-700 hover:border-slate-600 cursor-pointer w-50"
            aria-label="Select a persona"
          >
            <SelectValue placeholder="Select persona" />
          </SelectTrigger>

          {/* Select Persona Content */}
          <SelectContent align="end" className="rounded-xl">
            {personaNames.map((personaName) => {
              const configKey = personaName.toLowerCase().replace(/\s+/g, '-')
              const config = chartConfig[configKey as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={personaName}
                  value={personaName}
                  className=" [&_span]:flex hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 items-center justify-center min-h-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="w-full h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="bg-slate-800 w-60" />}
            />
            <Pie
              data={personaData}
              dataKey="percentage"
              className="cursor-pointer"
              nameKey="name"
              innerRadius={125}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={(data) => {
                if (data && data.name) {
                  setActivePersona(data.name);
                }
              }}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 30}  />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {/* Value */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-blue-500 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold border"
                        >
                          {personaData[activeIndex].percentage.toLocaleString()}%
                        </tspan>

                        {/* Percentage from audience */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-gray-400 text-xs sm:text-sm lg:text-base"
                        >
                          {}
                        </tspan>

                        {/* Name */}
                        {/* <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-gray-400 text-xs sm:text-sm lg:text-base"
                        >
                          {personaData[activeIndex].name}
                        </tspan> */}
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
