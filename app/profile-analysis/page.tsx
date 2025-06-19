
// imports
import * as React from "react"; 
import { Users } from "lucide-react";
import { tableData } from "@/lib/tableData";

export default function ProfileAnalysis() {

    const topBrands = tableData.topBrands;
    const topProducts = tableData.topProducts;
    const topDemographics = tableData.topDemographics;
    const topPersonas = tableData.topPersonas;
    const topConversations = tableData.topConversations;

    return (
        
        <div className="flex gap-4 h-screen">  

            {/* Left Side: Area Chart + Top Brands, Top Products, Top Demographics Tables  ------------------------------------------------------------ */}
            <div className="flex flex-1 flex-col gap-4 rounded-2xl p-4">

                {/* Area Chart */}
                <div className="rounded-2xl p-4 h-[70%]">

                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg font-bold">Overall Sentiment Relative to Engagement</h1>
                            <p className="text-sm text-gray-400">
                                This graph illustrates the overall sentiment of talent engagement, breaking down the data into positive, negative, and neutral categories. By analyzing these segments
                                we can gain insights into how talent perceives and interacts with our content, 
                            </p>
                        </div>


                </div>

                {/* Top Brands, Top Products, Top Demographics Tables */}
                <div className="flex gap-4 h-[50%]">

                    {/* Top Brands Table */}
                    <div className="flex flex-col rounded-2xl p-4 border border-slate-800 w-1/3 px-6 py-6 overflow-y-auto">

                        {/* Title and Description */}
                        <div className="flex flex-col gap-2 mb-8">
                            <h1 className="text-md font-bold">
                                Top Brands
                            </h1>
                            <p className="text-sm text-gray-400">
                                Top brands consistently mentined on a user's profile, revealing the most influential and frequently discussed names.
                            </p>
                        </div>

                        {/* Table */}
                        <div>
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topBrands[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topBrands[0].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topBrands[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topBrands[1].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topBrands[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topBrands[2].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topBrands[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topBrands[3].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 5 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">5. {topBrands[4].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topBrands[4].value}</div>
                            </div>
                            
                        </div>  
                    </div>

                    {/* Top Products Table */}
                    <div className="flex flex-col rounded-2xl p-4 border border-slate-800 w-1/3 px-6 py-6 overflow-y-auto">
                        {/* Title and Description */}
                        <div className="flex flex-col gap-2 mb-8">
                            <h1 className="text-md font-bold">
                                Top Products
                            </h1>
                            <p className="text-sm text-gray-400">
                                Top products consistently mentined on a user's profile, revealing the most influential and frequently discussed names.
                            </p>
                        </div>  

                        {/* Table */}
                        <div>
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topProducts[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topProducts[0].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topProducts[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topProducts[1].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topProducts[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topProducts[2].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topProducts[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topProducts[3].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 5 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">5. {topProducts[4].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topProducts[4].value}</div>
                            </div>
                        </div>
                    </div>  

                    {/* Top Demographics Table */}
                    <div className="flex flex-col rounded-2xl p-4 border border-slate-800 w-1/3 px-6 py-6 overflow-y-auto">
                        {/* Title and Description */}
                        <div className="flex flex-col gap-2 mb-8">
                            <h1 className="text-md font-bold">
                                Top Demographics
                            </h1>
                            <p className="text-sm text-gray-400">
                                Top demographics engaging with a user's profile, offering insights into the most active and influential audience segments.
                            </p>
                        </div>

                        {/* Table */}
                        <div>
                            {/* Row 1 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">1. {topDemographics[0].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topDemographics[0].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 2 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">2. {topDemographics[1].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topDemographics[1].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 3 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">3. {topDemographics[2].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topDemographics[2].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 4 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">4. {topDemographics[3].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topDemographics[3].value}</div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-slate-800 my-6"></div>
                            {/* Row 5 */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold">5. {topDemographics[4].name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /> {topDemographics[4].value}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Side: Top Personas, Top Conversations ------------------------------------------------------------ */}
            <div className="flex flex-col gap-4 w-[30%] bg-gray-900 p-4 border border-gray-800">

                {/* Top Personas ----------------------------- */}
                <div className="bg-gray-900 rounded-2xl p-4 border-gray-800 h-[50%] px-6 py-6 overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">

                    {/* Title and Description */}
                    <div className="flex flex-col gap-2 mb-8">
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
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center">
                            {/* image */}
                            <div className="bg-gray-800 h-12 w-12 rounded-4xl">
                                {/* This is where the image goes */}
                            </div>

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
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center">
                            {/* image */}
                            <div className="bg-gray-800 h-12 w-12 rounded-4xl">
                                {/* This is where the image goes */}
                            </div>

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
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center">
                            {/* image */}
                            <div className="bg-gray-800 h-12 w-12 rounded-4xl">
                                {/* This is where the image goes */}
                            </div>

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

                        {/* Row 4 */}
                        <div className="flex gap-4 border border-gray-800 rounded-2xl p-4 mb-4 items-center">
                            {/* image */}
                            <div className="bg-gray-800 h-12 w-12 rounded-4xl">
                                {/* This is where the image goes */}
                            </div>

                            {/* card intel */}
                            <div className="flex-1">
                                {/* top section: name, demo + % */}
                                <div className="flex justify-between items-center gap-2 mb-2">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-sm font-bold">{topPersonas[3].name}</h1>
                                        {/* <p className="text-xs text-gray-400">{topPersonas[3].demographics}</p> */}
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-bold">{topPersonas[3].percentage}%</p>
                                    </div>
                                </div>

                                {/* bottom section: description */}
                                <div>
                                    <p className="text-sm text-gray-400">{topPersonas[3].description}</p>
                                </div>

                            </div>
                        </div>


                    </div>

                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-800 my-6"></div>

                {/* Top Conversations ----------------------------- */}
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 h-[50%]">

                </div>

            </div>

        </div>
    )
}