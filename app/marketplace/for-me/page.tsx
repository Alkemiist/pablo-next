'use client'

// imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// this is the for-me marketplace page
export default function ForMeMarketplace() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8">
            <Tabs value="for-me" className="w-full max-w-6xl">
                <TabsContent value="for-me" className="mt-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Curated Projects For You</h2>
                        <p className="text-neutral-400">Hand-picked projects tailored to your interests and skills</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder curated project cards */}
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-lg border border-blue-700/50">
                                <div className="h-32 bg-gradient-to-br from-blue-700 to-purple-700 rounded-md mb-4"></div>
                                <h3 className="text-white font-semibold mb-2">Recommended Project</h3>
                                <p className="text-neutral-300 text-sm">This project matches your profile perfectly!</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-lg border border-green-700/50">
                                <div className="h-32 bg-gradient-to-br from-green-700 to-blue-700 rounded-md mb-4"></div>
                                <h3 className="text-white font-semibold mb-2">Perfect Match</h3>
                                <p className="text-neutral-300 text-sm">Based on your recent activity...</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-lg border border-purple-700/50">
                                <div className="h-32 bg-gradient-to-br from-purple-700 to-pink-700 rounded-md mb-4"></div>
                                <h3 className="text-white font-semibold mb-2">Trending Now</h3>
                                <p className="text-neutral-300 text-sm">Popular among users like you...</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}