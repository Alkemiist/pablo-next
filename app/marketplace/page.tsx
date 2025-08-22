'use client'

// imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"
import { generalProjects } from "@/lib/mp-general"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

// this is the marketplace page
export default function Marketplace() {

    // state
    const pathname = usePathname()
    
    // refs for carousel scrolling
    const trendingRef = useRef<HTMLDivElement>(null)
    const featuredRef = useRef<HTMLDivElement>(null)
    const newArrivalsRef = useRef<HTMLDivElement>(null)
    const popularRef = useRef<HTMLDivElement>(null)
    const recommendedRef = useRef<HTMLDivElement>(null)

    // scroll functions
    const scrollByAmount = () => {
        return 300 // Fixed scroll amount for consistent behavior
    }

    const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' })
    }

    const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' })
    }

    // OpportunityMedia component for video cards
    const OpportunityMedia = ({ videoUrl, title }: { videoUrl?: string; title: string }) => {
        const [useImage, setUseImage] = useState(false)
        const posterSrc = '/Image-card.png'
        
        return (
            <div className="h-72 w-full overflow-hidden relative">
                {!useImage && videoUrl ? (
                    <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={videoUrl}
                        poster={posterSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setUseImage(true)}
                    />
                ) : null}
                
                {/* Always show image as fallback or when no video */}
                <img src={posterSrc} alt={title} className="h-full w-full object-cover" />
            </div>
        )
    }

    // Row component for reusability
    const ProjectRow = ({ 
        title, 
        description, 
        projects, 
        carouselRef, 
        onScrollLeft, 
        onScrollRight 
    }: {
        title: string
        description: string
        projects: typeof generalProjects
        carouselRef: React.RefObject<HTMLDivElement | null>
        onScrollLeft: () => void
        onScrollRight: () => void
    }) => (
        <div className="flex flex-col gap-4 px-12 mt-8 overflow-hidden">
            <div className='flex items-end justify-between'>
                <div className='flex flex-col'>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className='text-sm text-slate-400'>{description}</p>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={onScrollLeft}
                        className="h-9 w-9 grid place-items-center rounded-lg bg-neutral-900 hover:bg-neutral-800"
                        aria-label={`Scroll ${title.toLowerCase()} left`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onScrollRight}
                        className="h-9 w-9 grid place-items-center rounded-lg bg-neutral-900 hover:bg-neutral-800"
                        aria-label={`Scroll ${title.toLowerCase()} right`}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div
                ref={carouselRef}
                className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container max-w-full"
                aria-label={`${title} carousel`}
            >
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="shrink-0 w-[300px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                    >
                        <OpportunityMedia videoUrl={project.videoUrl} title={project.title} />
                        <div className="p-5">
                            <div className="text-xl font-semibold leading-tight">{project.title}</div>
                            <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-3">{project.cardDescription}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-amber-400 font-medium">{project.brand}</span>
                                <span className="text-xs text-neutral-500">{project.budget?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

            {/* Trending Now */}
            <ProjectRow
                title="Trending Now"
                description="Most popular projects this week"
                projects={generalProjects.slice(0, 6)}
                carouselRef={trendingRef}
                onScrollLeft={() => scrollLeft(trendingRef)}
                onScrollRight={() => scrollRight(trendingRef)}
            />

            {/* Featured Projects */}
            <ProjectRow
                title="Featured Projects"
                description="Handpicked opportunities from top brands"
                projects={generalProjects.slice(1, 7)}
                carouselRef={featuredRef}
                onScrollLeft={() => scrollLeft(featuredRef)}
                onScrollRight={() => scrollRight(featuredRef)}
            />

            {/* New Arrivals */}
            <ProjectRow
                title="New Arrivals"
                description="Fresh opportunities just added"
                projects={generalProjects.slice(2, 8)}
                carouselRef={newArrivalsRef}
                onScrollLeft={() => scrollLeft(newArrivalsRef)}
                onScrollRight={() => scrollRight(newArrivalsRef)}
            />

            {/* Popular Categories */}
            <ProjectRow
                title="Popular Categories"
                description="Trending across different industries"
                projects={generalProjects.slice(3, 9)}
                carouselRef={popularRef}
                onScrollLeft={() => scrollLeft(popularRef)}
                onScrollRight={() => scrollRight(popularRef)}
            />

            {/* Recommended for You */}
            <ProjectRow
                title="Recommended for You"
                description="Personalized based on your interests"
                projects={generalProjects.slice(4, 10)}
                carouselRef={recommendedRef}
                onScrollLeft={() => scrollLeft(recommendedRef)}
                onScrollRight={() => scrollRight(recommendedRef)}
            />
        </div>
    )
}