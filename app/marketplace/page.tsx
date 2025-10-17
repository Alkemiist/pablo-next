'use client'

// imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"
import { generalProjects } from "@/lib/mp-general"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import BriefCard, { PublishedBrief } from '../components/marketplace/brief-card'

// this is the marketplace page
export default function Marketplace() {

    // state
    const pathname = usePathname()
    const [publishedBriefs, setPublishedBriefs] = useState<PublishedBrief[]>([])
    const [isLoadingBriefs, setIsLoadingBriefs] = useState(true)
    
    // refs for carousel scrolling
    const publishedBriefsRef = useRef<HTMLDivElement>(null)
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

    // Load published briefs
    useEffect(() => {
        const loadPublishedBriefs = async () => {
            try {
                setIsLoadingBriefs(true)
                const response = await fetch('/api/marketplace/publish')
                if (response.ok) {
                    const data = await response.json()
                    setPublishedBriefs(data.publishedBriefs || [])
                }
            } catch (error) {
                console.error('Error loading published briefs:', error)
            } finally {
                setIsLoadingBriefs(false)
            }
        }

        loadPublishedBriefs()
    }, [])

    // OpportunityMedia component for video cards (used in carousel rows)
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

    // FullCardMedia component for hero and twin hero sections only
    const FullCardMedia = ({ videoUrl, title }: { videoUrl?: string; title: string }) => {
        const [useImage, setUseImage] = useState(false)
        const posterSrc = '/Image-card.png'
        
        return (
            <div className="h-full w-full overflow-hidden">
                {!useImage && videoUrl ? (
                    <video
                        className="h-full w-full object-cover"
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
                        className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                        aria-label={`Scroll ${title.toLowerCase()} left`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onScrollRight}
                        className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
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
                        className="shrink-0 w-[300px] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                    >
                        <OpportunityMedia videoUrl={project.videoUrl} title={project.title} />
                        <div className="p-5">
                            <div className="text-xl font-semibold leading-tight">{project.title}</div>
                            <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-3">{project.cardDescription}</p>
                            {/* <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-amber-400 font-medium">{project.brand}</span>
                                <span className="text-xs text-neutral-500">{project.budget?.toLocaleString()}</span>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    // Twin Hero component for featured projects
    const TwinHero = ({ 
        leftProject, 
        rightProject,
        title,
        description
    }: { 
        leftProject: typeof generalProjects[0]
        rightProject: typeof generalProjects[0]
        title: string
        description: string
    }) => (
        <div className="px-12 mt-12">
            <div className="flex flex-col gap-4 mb-4">
                <div className='flex flex-col'>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className='text-sm text-slate-400'>{description}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Hero */}
                <div
                    className="relative h-[360px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/40 border border-neutral-800 hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-200 ease-out"
                >
                    <FullCardMedia videoUrl={leftProject.videoUrl} title={leftProject.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                        {/* <div className="flex items-center gap-2 text-[11px] text-slate-300">
                            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                                {leftProject.brand}
                            </span>
                            <span className="text-amber-400 font-medium">
                                ${leftProject.budget?.toLocaleString()}
                            </span>
                        </div> */}
                        <h3 className="text-xl md:text-2xl font-bold leading-tight">
                            {leftProject.title}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-3 max-w-2xl">
                            {leftProject.cardDescription}
                        </p>
                    </div>
                </div>

                {/* Right Hero */}
                <div
                    className="relative h-[360px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/40 border border-neutral-800 hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-200 ease-out"
                >
                    <FullCardMedia videoUrl={rightProject.videoUrl} title={rightProject.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                        {/* <div className="flex items-center gap-2 text-[11px] text-slate-300">
                            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                                {rightProject.brand}
                            </span>
                            <span className="text-amber-400 font-medium">
                                ${rightProject.budget?.toLocaleString()}
                            </span>
                        </div> */}
                        <h3 className="text-xl md:text-2xl font-bold leading-tight">
                            {rightProject.title}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-3 max-w-2xl">
                            {rightProject.cardDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden mb-12">

            {/* Hero Banner - Single featured project */}
            <div className="px-12 mt-8 mb-8">
                {(() => {
                    const heroProject = generalProjects[0]; // Use the first project as hero
                    return (
                        <div className="relative h-[460px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/40 border border-neutral-800 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]">
                            <FullCardMedia videoUrl={heroProject.videoUrl} title={heroProject.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
                                {/* <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                                        {heroProject.brand}
                                    </span>
                                    <span className="text-amber-400 font-medium">
                                        ${heroProject.budget?.toLocaleString()}
                                    </span>
                                </div> */}
                                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                    {heroProject.title}
                                </h2>
                                <p className="text-sm md:text-base text-neutral-400 line-clamp-3 max-w-3xl">
                                    {heroProject.cardDescription}
                                </p>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Published Briefs Row */}
            {publishedBriefs.length > 0 && (
                <div className="flex flex-col gap-4 px-12 mt-8">
                    <div className='flex items-end justify-between'>
                        <div className='flex flex-col'>
                            <h3 className="text-xl font-bold">Published Briefs</h3>
                            <p className='text-sm text-slate-400'>Fresh marketing briefs from the community</p>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => scrollLeft(publishedBriefsRef)}
                                className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                aria-label="Scroll published briefs left"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => scrollRight(publishedBriefsRef)}
                                className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                aria-label="Scroll published briefs right"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div
                        ref={publishedBriefsRef}
                        className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container max-w-full"
                        aria-label="Published briefs carousel"
                    >
                        {publishedBriefs.map((brief) => (
                            <BriefCard
                                key={brief.id}
                                brief={brief}
                                onSave={(briefId) => {
                                    // Update local state or refetch
                                    console.log('Brief saved:', briefId)
                                }}
                                onInterested={(briefId) => {
                                    // Update local state or refetch
                                    console.log('Brief marked as interested:', briefId)
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

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

            {/* Twin Hero Section 1 - After 2 carousel rows */}
            <TwinHero 
                leftProject={generalProjects[2]} 
                rightProject={generalProjects[3]} 
                title="Twin Hero Section 1"
                description="Handpicked opportunities from top brands"
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

            {/* Twin Hero Section 2 - After 2 more carousel rows */}
            <TwinHero 
                leftProject={generalProjects[4]} 
                rightProject={generalProjects[5]} 
                title="Featured Showcase"
                description="Premium opportunities worth highlighting"
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