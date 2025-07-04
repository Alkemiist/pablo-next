'use client'

// imports 
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { ArrowUpDown, Scan, Calendar } from "lucide-react"; 
import { useState } from "react";

export function SentimentBar() {

    // state variables
    const [sort, setSort] = useState("date-created");
    const [filter, setFilter] = useState("all");
    const [timeRange, setTimeRange] = useState("7d");

    // handle sort change
    const handleSortChange = (value: string) => {
        setSort(value);
    }

    // handle filter change
    const handleFilterChange = (value: string) => {
        setFilter(value);
    }

    // handle time range change
    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
    }

    // return component
    return (
        // the parent div
        <div className="h-[60px] flex justify-end items-center px-6 mt-2">

            <div className="flex items-center gap-4">

                {/* sort */}
                <div className="relative">
                    <Select value={sort} onValueChange={handleSortChange}>
                        <SelectTrigger className="border border-slate-700 rounded-lg pl-8 y-2 text-white cursor-pointer outline-none ">
                            <SelectValue placeholder="Sort">
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 text-white rounded-md shadow-xl border border-slate-700 w-56">
                            <SelectItem value="date-created" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Most Recent</SelectItem>
                            <SelectItem value="date-updated" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Less Recent</SelectItem>
                            <SelectItem value="name-asc" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Date Created</SelectItem>
                        </SelectContent>
                    </Select>
                    <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>

                {/* filter */}
                <div className="relative">
                    <Select value={filter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="border border-slate-700 rounded-lg pl-8 y-2 text-white cursor-pointer outline-none ">
                            <SelectValue placeholder="Filter">
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 text-white rounded-md shadow-xl border border-slate-700 w-56">
                            <SelectItem value="all" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">All</SelectItem>
                            <SelectItem value="positive" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Positive</SelectItem>
                            <SelectItem value="neutral" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Neutral</SelectItem>
                            <SelectItem value="negative" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Negative</SelectItem>
                        </SelectContent>
                    </Select>
                    <Scan className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>

                {/* Time Range */}
                <div className="relative">
                    <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                        <SelectTrigger className="border border-slate-700 rounded-lg pl-8 y-2 text-white cursor-pointer outline-none ">
                            <SelectValue placeholder="Date Window">
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 text-white rounded-md shadow-xl border border-slate-700 w-56">
                            <SelectItem value="7d" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Last 7 days</SelectItem>
                            <SelectItem value="30d" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Last 30 days</SelectItem>
                            <SelectItem value="90d" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>
                
            </div>


        </div>
    )
}