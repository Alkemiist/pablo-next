

// imports 
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { Bookmark, RefreshCcw, FileText, Rss, Book, ArrowBigDownDash } from "lucide-react";
import Link from "next/link";

export default function AnalysisTopBar() {

    const pathname = usePathname();

    return (
        <div className="bg-gray-950 p-4 border border-gray-800 flex justify-between items-center h-[60px]">
            
            {/* left section: profile image + name + date */}
            <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/48?img=1" alt="profile" className="w-8 h-8 rounded-full border" />
                <div className="">
                    <h1 className="text-sm font-bold">Ganondorf the Grey</h1>
                    <p className="text-xs text-gray-400">Data as of {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* middle section: tabs  */}
            <div className="flex items-center gap-2">
                <Tabs defaultValue="summary" className="flex">
                    <TabsList className='bg-gray-950 border border-gray-700 rounded-xl px-2 gap-8'>
                        <Link href="/profile-analysis">
                            <TabsTrigger 
                                value="summary"
                                className={`text-xs font-bold cursor-pointer ${pathname === '/profile-analysis' ? 'bg-slate-900 border border-gray-700' : ''}`}
                            >
                                Summary
                            </TabsTrigger>
                        </Link>
                        <Link href="/profile-analysis/personas">
                            <TabsTrigger 
                                value="personas" 
                                className={`text-xs font-bold cursor-pointer ${pathname === '/profile-analysis/personas' ? 'bg-gray-900 border border-gray-700' : ''}`}
                                
                            >
                                Personas
                            </TabsTrigger>
                        </Link>
                        <Link href="/profile-analysis/sentiment">
                            <TabsTrigger 
                                value="sentiment" 
                                className={`text-xs font-bold cursor-pointer ${pathname === '/profile-analysis/sentiment' ? 'bg-gray-900 border border-gray-700' : ''}`}
                            >
                                Sentiment
                            </TabsTrigger>
                        </Link>
                    </TabsList>
                </Tabs>
            </div>

            {/* right section: cta stack */}
            <div className="flex items-center gap-2">
                <button className="text-xs font-bold border border-gray-700 rounded-lg px-2 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-all duration-300"><Bookmark size={14} className="" /></button>
                <button className="text-xs font-bold border border-gray-700 rounded-lg px-6 py-2 flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-all duration-300">Subscribe<Rss size={14} className="" /></button>
                <button className="text-xs font-bold border border-gray-700 rounded-lg px-6 py-2 flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-all duration-300">Refresh Data<RefreshCcw size={14} className="" /></button>
                <button className="text-xs font-bold border border-gray-700 bg-blue-700 rounded-lg px-6 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-800 transition-all duration-300">Export<ArrowBigDownDash size={14} className="" /></button>
            </div>

        </div>
    )
}