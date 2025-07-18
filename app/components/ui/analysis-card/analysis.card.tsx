"use client"

import { sentimentCardData } from "@/lib/sentiment-card-data";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

// These are the types for the Analysis Card
type AnalysisCardProps = {
    title: string;
    description: string;
    sentiment: string;
    sentimentScore: number;
}

// Generate mock trend data based on sentiment score
const generateTrendData = (sentimentScore: number) => {
    const baseValue = sentimentScore * 100;
    return [
        { day: "Mon", value: baseValue * 0.8 },
        { day: "Tue", value: baseValue * 0.9 },
        { day: "Wed", value: baseValue * 1.1 },
        { day: "Thu", value: baseValue * 0.95 },
        { day: "Fri", value: baseValue * 1.05 },
        { day: "Sat", value: baseValue },
        { day: "Sun", value: baseValue * 1.15 },
    ];
};

export function AnalysisCard({ title, description, sentiment, sentimentScore }: AnalysisCardProps) {

    // Generate chart data based on sentiment score
    const chartData = generateTrendData(sentimentScore);

    
    // return component
    return (

        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 shadow-xl flex flex-col justify-between">

            {/* Sentiment and Sentiment Score */}
            <div className="flex justify-between items-center px-2">
                <p className={`text-sm font-bold ${sentiment === "Positive" ? "text-green-500" : sentiment === "Negative" ? "text-red-500" : "text-yellow-500"}`}>{sentiment}</p>
                <p className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">{ sentimentScore * 100 }%</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700 my-4"></div>

            {/* Title and Description */}
            <h1 className="text-lg font-bold mb-2">{title}</h1>
            <p className="text-sm text-slate-400 mb-2">{description}</p>
            
            {/* Mini Sentiment Trend Chart */}
            <div className="h-24 mb-4">
                <ResponsiveContainer width="100%" height="100%" className="mt-2 p-2">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                            dataKey="day" 
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            hide={true}
                            domain={[0, 100]}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #475569',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                            }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={sentiment === "Positive" ? "#10b981" : sentiment === "Negative" ? "#ef4444" : "#eab308"}
                            strokeWidth={2}
                            dot={{ 
                                fill: sentiment === "Positive" ? "#10b981" : sentiment === "Negative" ? "#ef4444" : "#eab308",
                                strokeWidth: 2,
                                r: 3
                            }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* CTA to view more information */}
            {/* <button 
                className="text-sm text-slate-400 border border-slate-700 bg-slate-800 h-12 rounded-md px-2 py-1 mt-2 hover:bg-slate-700 hover:text-slate-200 transition-all duration-100 cursor-pointer"
            >
                View Comments
            </button> */}
        </div>
    )

}