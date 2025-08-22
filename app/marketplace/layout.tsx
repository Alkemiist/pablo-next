'use client'

// imports
import { usePathname, useRouter } from "next/navigation"

// this is the marketplace layout that wraps all marketplace pages
export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {

    // state
    const pathname = usePathname()
    const router = useRouter()

    // determine the current tab value based on pathname
    const isGeneralActive = pathname === "/marketplace"
    const isForMeActive = pathname === "/marketplace/for-me"

    return (
        <div>
            {/* header bar */}
            <div className="sticky top-0 z-50 flex flex-row items-center justify-center w-full h-16 border-b border-neutral-800 px-8 bg-black/95 backdrop-blur-sm">
                
                {/* custom tabs: For me, general projects */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-md flex">
                    <button
                        onClick={() => router.push("/marketplace")}
                        className={`px-8 py-2 rounded-l-md transition-all duration-200 cursor-pointer font-medium text-sm ${
                            isGeneralActive 
                                ? "bg-neutral-700/60 text-white" 
                                : "text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50"
                        }`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => router.push("/marketplace/for-me")}
                        className={`px-8 py-2 rounded-r-md transition-all duration-200 cursor-pointer font-medium text-sm ${
                            isForMeActive 
                                ? "bg-neutral-700/60 text-white" 
                                : "text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50"
                        }`}
                    >
                        For Me
                    </button>
                </div>

                {/* create project button */}
                <div className="ml-auto">
                    <button className="bg-blue-600 hover:bg-blue-500 px-12 cursor-pointer text-white font-semibold text-sm py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]">
                        Create Project
                    </button>
                </div>

            </div>
            
            {/* main content - this is where the page content will be rendered */}
            {children}
            
        </div>
    );
}
