'use client'

// imports
import * as React from "react"; 
import { Users } from "lucide-react";
import { tableData } from "@/lib/tableData";
import { useState } from "react";
import { TrendingUp, TrendingDown, TrendingUpDown, Info, Gauge, CircleSlash2 } from "lucide-react";
import { AnalysisChart } from "../components/global/area chart/analysis-chart";

export default function ProfileAnalysis() {

    const topBrands = tableData.topBrands;
    const topNamedEntities = tableData.topNamedEntities;
    const topCategories = tableData.topCategories;
    const topPersonas = tableData.topPersonas;
    const topConversations = tableData.topConversations;

    // create sentiment state
    const [sentiment, setSentiment] = useState<string>("");

    return (
        
        <div className="flex gap-4">  

            {/* Left Side: Area Chart + Top Brands, Top Products, Top Demographics Tables  ------------------------------------------------------------ */}
            <div className="flex flex-1 flex-col gap-6 rounded-2xl p-4 w-[66%] ml-4">

                {/* Area Chart */}
                <div className=" flex flex-col gap-8 rounded-2xl pt-2 h-[60%]">

                        {/* Title and Description */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg font-bold">Overall Sentiment Relative to Engagement</h1>
                            <p className="text-sm text-gray-400">
                                This graph illustrates the overall sentiment of talent engagement, breaking down the data into positive, negative, and neutral categories. By analyzing these segments
                                we can gain insights into how talent perceives and interacts with our content, 
                            </p>
                        </div>

                        {/* Chart */}
                        <div className="h-full w-full">
                            <AnalysisChart />
                        </div>

                </div>

                {/* Top Brands, Top Products, Top Demographics Tables */}
                <div className="flex gap-4 h-[40%]">

                    {/* Top Brands Table */}
                    <div className="flex flex-col rounded-2xl border border-slate-800 w-1/3 overflow-y-auto">

                        {/* Title and Description */}
                        <div className="flex gap-2 items-center p-4 border-b border-slate-800 sticky top-0 bg-gray-900 justify-between h-[20%]">
                            <h1 className="text-sm font-bold">
                                Top Brands
                            </h1>
                            {/* Icon */}
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Info className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Top Brands Table */}
                        <div className="flex flex-col justify-between px-4 py-8 h-[80%]">
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topBrands[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topBrands[0].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topBrands[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topBrands[1].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topBrands[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topBrands[2].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topBrands[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topBrands[3].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                        </div>  
                    </div>

                    {/* Top Named Entities Table */}
                    <div className="flex flex-col rounded-2xl border border-slate-800 w-1/3 overflow-y-auto">
                        {/* Title and Description */}
                        <div className="flex gap-2 items-center p-4 border-b border-slate-800 sticky top-0 bg-gray-900 justify-between h-[20%]">
                            <h1 className="text-sm font-bold">
                                Top Named Entities
                            </h1>
                            {/* Icon */}
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Info className="w-4 h-4 text-gray-400" />
                            </div>
                        </div> 

                        {/* Top Named Entities Table */}
                        <div className="flex flex-col justify-between px-4 py-8 h-[80%]">
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topNamedEntities[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topNamedEntities[0].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topNamedEntities[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topNamedEntities[1].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topNamedEntities[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topNamedEntities[2].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topNamedEntities[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topNamedEntities[3].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                        </div>
                    </div>  

                    {/* Top Categories Table */}
                    <div className="flex flex-col rounded-2xl border border-slate-800 w-1/3 overflow-y-auto">

                        {/* Title and Description */}
                        <div className="flex gap-2 items-center p-4 border-b border-slate-800 sticky top-0 bg-gray-900 justify-between h-[20%]">
                            <h1 className="text-sm font-bold">
                                Top Categories
                            </h1>
                            {/* Icon */}
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Info className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Top Categories Table */}
                        <div className="flex flex-col justify-between px-4 py-8 h-[80%]">
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topCategories[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topCategories[0].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topCategories[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topCategories[1].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topCategories[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topCategories[2].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topCategories[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">{topCategories[3].percentage}% <CircleSlash2 className="w-3 h-3" /> </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Right Side: Top Personas, Top Conversations ------------------------------------------------------------ */}
            <div className="flex flex-col gap-2 w-[33%] bg-gray-950 border-l border-gray-800 h-[calc(100vh-60px)] overflow-y-scroll">

                {/* Top Personas Component ----------------------------- */}
                <div className="bg-gray-950 rounded-2xl p-4 border-gray-800 px-6 flex-1">

                    {/* Title and Description */}
                    <div className="flex flex-col gap-2 mb-6">
                        <h1 className="text-md font-bold">
                            Top Personas
                        </h1>
                        <p className="text-sm text-gray-400">
                            Top personas we've identified, providing key insights into their audience for more targeted and effective engagement.
                        </p>
                    </div>

                    {/* Top Personas Data */}
                    <div className="">

                        {/* Row 1 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center shadow-lg">
                            {/* image */}
                            <img 
                                src={`https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 70) + 1}`}
                                alt={`${topPersonas[0].name} avatar`}
                                className="h-12 w-12 rounded-full object-cover border shadow-md"
                            />

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topPersonas[0].name}</h1>
                                        {/* <p className="text-xs text-gray-400">{topPersonas[0].demographics}</p> */}
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-bold">{topPersonas[0].percentage}%</p>
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topPersonas[0].description}</p>
                                </div>

                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center shadow-lg">
                            {/* image */}
                            <img 
                                src={`https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 70) + 1}`}
                                alt={`${topPersonas[1].name} avatar`}
                                className="h-12 w-12 rounded-full object-cover border shadow-md"
                            />

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topPersonas[1].name}</h1>
                                        {/* <p className="text-xs text-gray-400">{topPersonas[1].demographics}</p> */}
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-bold">{topPersonas[1].percentage}%</p>
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topPersonas[1].description}</p>
                                </div>

                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-2 items-center shadow-lg">
                            {/* image */}
                            <img 
                                src={`https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 70) + 1}`}
                                alt={`${topPersonas[2].name} avatar`}
                                className="h-12 w-12 rounded-full object-cover border shadow-md"
                            />

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topPersonas[2].name}</h1>
                                        {/* <p className="text-xs text-gray-400">{topPersonas[2].demographics}</p> */}
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-bold">{topPersonas[2].percentage}%</p>
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topPersonas[2].description}</p>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

                {/* Top Conversations ----------------------------- */}
                <div className="bg-gray-950 rounded-2xl p-4 border-gray-800 px-6 flex-1">

                    {/* Title and Description */}
                    <div className="flex flex-col gap-2 mb-6">
                        <h1 className="text-md font-bold">
                            Top Conversations
                        </h1>
                        <p className="text-sm text-gray-400">
                            Top conversations we've identified, providing key insights into their audience for more targeted and effective engagement.
                        </p>
                    </div>

                    {/* Top Conversations Data */}
                    <div className="">

                        {/* Row 1 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center shadow-lg">


                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topConversations[0].name}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-bold ${topConversations[0].sentiment === "Positive" ? "text-green-500" : topConversations[0].sentiment === "Negative" ? "text-red-500" : "text-gray-400"}`}>{topConversations[0].sentiment}</p>
                                        { topConversations[0].sentiment === "Positive" ? <TrendingUp className="w-4 h-4 text-green-500 stroke3" /> : topConversations[0].sentiment === "Negative" ? <TrendingDown className="w-4 h-4 text-red-500 stroke-2" /> : <TrendingUpDown className="w-4 h-4 text-gray-400 stroke-2" /> }
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topConversations[0].description}</p>
                                </div>

                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center shadow-lg">

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topConversations[1].name}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-bold ${topConversations[1].sentiment === "Positive" ? "text-green-500" : topConversations[1].sentiment === "Negative" ? "text-red-500" : "text-gray-400"}`}>{topConversations[1].sentiment}</p>
                                        { topConversations[1].sentiment === "Positive" ? <TrendingUp className="w-4 h-4 text-green-500" /> : topConversations[1].sentiment === "Negative" ? <TrendingDown className="w-4 h-4 text-red-500" /> : <TrendingUpDown className="w-4 h-4 text-gray-400" /> }
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topConversations[1].description}</p>
                                </div>

                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center shadow-lg">

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topConversations[2].name}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-bold ${topConversations[2].sentiment === "Positive" ? "text-green-500" : topConversations[2].sentiment === "Negative" ? "text-red-500" : "text-gray-400"}`}>{topConversations[2].sentiment}</p>
                                        { topConversations[2].sentiment === "Positive" ? <TrendingUp className="w-4 h-4 text-green-500" /> : topConversations[2].sentiment === "Negative" ? <TrendingDown className="w-4 h-4 text-red-500" /> : <TrendingUpDown className="w-4 h-4 text-gray-400" /> }
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topConversations[2].description}</p>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}