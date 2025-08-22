'use client'

// imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"

// this is the marketplace page
export default function Marketplace() {

    // state
    const pathname = usePathname()

    return (
        <div>

            {/* header bar */}
            <div className="flex flex-row items-center justify-center w-full bg-neutral-900 h-16 px-4">
                
                {/* tabs: For me, general projects */}
                <Tabs defaultValue={pathname === "/marketplace" ? "general" : "for-me"}>
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="for-me">For Me</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* filter & sort */}


                {/* create project button */}


            </div>
            
            {/* main content */}
            <div className="flex flex-col items-center justify-center h-screen w-full">
            
            </div>
            
        </div>
    );
}