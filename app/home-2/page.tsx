'use client';

// imports
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

// news article interface
type Article = {
    title: string;
    description: string;
    urlToImage: string;
    url: string;
    source?: { name?: string };
    publishedAt?: string;
};

// this is the home component
function Home() {
    
    // state
    const [ news, setNews ] = useState<Article[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ category, setCategory ] = useState<string>('general');
    const [ searchTerm, setSearchTerm ] = useState<string>('');
    const [ debouncedQuery, setDebouncedQuery ] = useState<string>('');
    const [ pageSize ] = useState<number>(30);
    const carouselRef = useRef<HTMLDivElement>(null);
    const oppCarouselRef = useRef<HTMLDivElement>(null);
    const stadiumCarouselRef = useRef<HTMLDivElement>(null);
    const counterCarouselRef = useRef<HTMLDivElement>(null);
    const powerfulCarouselRef = useRef<HTMLDivElement>(null);
    const evPioneersRef = useRef<HTMLDivElement>(null);
    const motorsportRef = useRef<HTMLDivElement>(null);
    

    // Nissan-specific news data
    const nissanNews: Article[] = useMemo(() => [
        {
            title: "Nissan Unveils Next-Generation Electric Vehicle Platform",
            description: "The Japanese automaker introduces a revolutionary EV architecture promising 500+ mile range and 15-minute charging times, positioning Nissan as a leader in sustainable mobility.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "Auto Industry News" },
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Nissan's Autonomous Driving Technology Surpasses Safety Standards",
            description: "Advanced driver assistance systems achieve 99.9% accuracy in real-world testing, setting new industry benchmarks for vehicle safety and reliability.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "Tech Auto Weekly" },
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Global EV Market Surge: Nissan Leads European Expansion",
            description: "Electric vehicle adoption accelerates across Europe with Nissan's comprehensive charging network and innovative battery technology driving market growth.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "European Auto Report" },
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Nissan's Motorsport Division Announces Formula E Entry",
            description: "Historic racing heritage meets electric innovation as Nissan prepares to compete in the world's premier electric racing championship.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "Racing News" },
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Sustainable Manufacturing: Nissan's Carbon-Neutral Factory Initiative",
            description: "Revolutionary production methods reduce environmental impact while maintaining quality standards, showcasing the future of automotive manufacturing.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "Green Manufacturing" },
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Connected Car Revolution: Nissan's Smart City Integration",
            description: "Vehicle-to-infrastructure technology enables seamless urban mobility, reducing traffic congestion and improving air quality in metropolitan areas.",
            urlToImage: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
            url: "#",
            source: { name: "Smart Cities Today" },
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
    ], []);
    
    // persona cards interface
    type PersonaCard = {
        name: string;
        summary: string;
        imageUrl: string;
    };

    // Explore Audiences Section - Automotive Industry Focus
    const personas: PersonaCard[] = useMemo(
        () => [
            {
                name: 'EV Early Adopters',
                summary:
                    'Tech-savvy professionals who prioritize sustainability and cutting-edge automotive technology in their purchasing decisions.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Performance Enthusiasts',
                summary:
                    'Driving enthusiasts who value power, handling, and the emotional connection between driver and machine.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Family Safety Seekers',
                summary:
                    'Parents prioritizing advanced safety features, reliability, and spacious interiors for family transportation needs.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Urban Commuters',
                summary:
                    'City dwellers seeking compact, efficient vehicles with smart connectivity and easy parking solutions.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Luxury Aspirants',
                summary:
                    'Status-conscious consumers who equate premium vehicles with personal achievement and social standing.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Adventure Seekers',
                summary:
                    'Outdoor enthusiasts requiring rugged, capable vehicles for off-road exploration and outdoor activities.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Business Professionals',
                summary:
                    'Corporate executives and entrepreneurs who need reliable, professional vehicles for client meetings and business travel.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Tech Innovators',
                summary:
                    'Early adopters of autonomous features, connected services, and cutting-edge automotive technology.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Environmental Advocates',
                summary:
                    'Conscious consumers prioritizing low emissions, sustainable materials, and eco-friendly manufacturing processes.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Classic Car Collectors',
                summary:
                    'Automotive historians who appreciate heritage, craftsmanship, and the stories behind iconic vehicle designs.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Fleet Managers',
                summary:
                    'Corporate decision-makers responsible for large vehicle purchases and fleet optimization strategies.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Motorsport Fans',
                summary:
                    'Racing enthusiasts who follow professional motorsports and appreciate high-performance engineering.',
                imageUrl:
                    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
        ],
        []
    );

        // Projects / Opportunities Section - Nissan Automotive Focus
const projectData = [
    {
        title: 'Electric Vehicle Charging Network',
        description:
            'Partner with Nissan to expand fast-charging infrastructure across major highways and urban centers, creating seamless EV travel experiences.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
        title: 'Autonomous Vehicle Testing Program',
        description:
            'Collaborate on real-world autonomous driving trials in smart cities, advancing safety technology and regulatory frameworks.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        title: 'Sustainable Manufacturing Partnership',
        description:
            'Joint venture to develop carbon-neutral production methods and circular economy solutions for automotive manufacturing.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    {
        title: 'Motorsport Innovation Hub',
        description:
            'Co-develop high-performance electric racing technology and transfer learnings to consumer vehicle development.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    {
        title: 'Smart City Mobility Platform',
        description:
            'Integrated transportation solution combining electric vehicles, charging infrastructure, and urban planning for sustainable cities.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
        title: 'Battery Technology Consortium',
        description:
            'Multi-stakeholder initiative to advance solid-state battery development and establish industry standards for next-gen EVs.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
    {
        title: 'Fleet Electrification Program',
        description:
            'Large-scale conversion of corporate and municipal fleets to electric vehicles with comprehensive support infrastructure.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    },
    {
        title: 'Connected Vehicle Ecosystem',
        description:
            'Development of vehicle-to-everything (V2X) communication systems for enhanced safety and traffic management.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
        title: 'Renewable Energy Integration',
        description:
            'Solar-powered charging stations and vehicle-to-grid technology to create sustainable energy ecosystems.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
        title: 'Digital Retail Experience',
        description:
            'Revolutionary online-to-offline car buying journey with virtual showrooms and seamless digital transactions.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
    {
        title: 'Circular Economy Initiative',
        description:
            'End-to-end vehicle lifecycle management including remanufacturing, recycling, and sustainable material sourcing.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    },
    {
        title: 'Urban Air Mobility Research',
        description:
            'Exploration of electric vertical takeoff and landing (eVTOL) technology for future urban transportation solutions.',
        imageUrl:
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
]

    // Counter Audiences Section - Automotive Industry Focus
    const counterAudiences: PersonaCard[] = useMemo(
        () => [
            { name: 'Rural EV Adopters', summary: 'Country dwellers who prioritize sustainability and long-range capabilities for sparse charging infrastructure.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Classic Car EV Converters', summary: 'Vintage enthusiasts retrofitting electric powertrains into classic vehicles for modern performance.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Off-Road Electric Explorers', summary: 'Adventure seekers who demand both rugged capability and environmental consciousness in their vehicles.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Luxury Performance EV Buyers', summary: 'High-end consumers who expect both premium craftsmanship and cutting-edge electric technology.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Commercial Fleet EV Managers', summary: 'Business leaders prioritizing total cost of ownership and sustainability in large vehicle operations.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Motorsport EV Spectators', summary: 'Racing fans who appreciate the technical innovation and environmental benefits of electric motorsport.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Urban Delivery EV Operators', summary: 'Last-mile logistics companies seeking efficient, quiet, and sustainable urban delivery solutions.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Emergency Service EV Adopters', summary: 'First responders requiring reliable, high-performance electric vehicles for critical operations.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Agricultural EV Innovators', summary: 'Farmers and agricultural businesses adopting electric machinery for sustainable food production.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Marine EV Enthusiasts', summary: 'Boat owners and marine businesses transitioning to electric propulsion for cleaner waterways.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Aviation EV Pioneers', summary: 'Private pilots and aviation companies exploring electric aircraft for sustainable air travel.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Construction EV Contractors', summary: 'Building professionals adopting electric construction equipment for urban and indoor projects.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ],
        []
    );

    // to slug
    const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // opportunity media component
    const OpportunityMedia = ({ videoUrl, imageUrl, title }: { videoUrl?: string; imageUrl: string; title: string }) => {
        const [useImage, setUseImage] = useState(false);
        const derivedUrl = videoUrl || `/videos/opportunities/${toSlug(title)}.mp4`;
        return (
            <div className="h-72 w-full overflow-hidden relative">
                {!useImage && videoUrl ? (
                    <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={derivedUrl}
                        poster={imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setUseImage(true)}
                    />
                ) : (
                    <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
                )}
            </div>
        );
    };

    // scroll by amount
    const scrollByAmount = () => {
        const width = carouselRef.current?.clientWidth || 0;
        return Math.max(300, Math.round(width * 0.9));
    };

    const scrollLeft = () => {
        carouselRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollOppLeft = () => {
        oppCarouselRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollOppRight = () => {
        oppCarouselRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollStadiumLeft = () => {
        stadiumCarouselRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollStadiumRight = () => {
        stadiumCarouselRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollCounterLeft = () => {
        counterCarouselRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollCounterRight = () => {
        counterCarouselRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollPowerfulLeft = () => {
        powerfulCarouselRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollPowerfulRight = () => {
        powerfulCarouselRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollEvPioneersLeft = () => {
        evPioneersRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollEvPioneersRight = () => {
        evPioneersRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    const scrollMotorsportLeft = () => {
        motorsportRef.current?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    };

    const scrollMotorsportRight = () => {
        motorsportRef.current?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    };

    // Opportunity Cards
    
    type OpportunityCard = {
        title: string;
        description: string;
        imageUrl: string; // used as poster/fallback
        videoUrl?: string; // optional autoplaying background video
    };

    type StadiumCard = {
        name: string;
        summary: string;
        imageUrl: string;
    };

    const formatTimeAgo = (isoDate?: string): string | null => {
        if (!isoDate) return null;
        const then = new Date(isoDate).getTime();
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));
        const minutes = Math.floor(diffSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days >= 7) return new Date(isoDate).toLocaleDateString();
        if (days >= 1) return `${days}d ago`;
        if (hours >= 1) return `${hours}h ago`;
        if (minutes >= 1) return `${minutes}m ago`;
        return `just now`;
    };

    // search debounce (not used after removing search UI but preserved for potential future use)
    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(searchTerm.trim()), 450);
        return () => clearTimeout(id);
    }, [searchTerm]);

    // fetch the news when filters change
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedQuery) params.set('q', debouncedQuery);
                if (!debouncedQuery && category) params.set('category', category);
                params.set('pageSize', String(pageSize));

                const response = await fetch(`/api/news?${params.toString()}`);
                const data = await response.json();
                setNews(data.articles || []);
            } catch (error) {
                console.error('Error fetching news:', error);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [category, debouncedQuery, pageSize]);

    // loading
    if ( loading ) {
        return <div className="text-2xl font-bold">Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            

            {/* Top Hero - Nissan News Feature */}
            {nissanNews.length > 0 && (
                <div className="px-12 mt-8 mb-8">
                    {(() => {
                        const article = nissanNews[0];
                        return (
                            <div
                                key={article.title}
                                onClick={() => window.open(article.url, '_blank')}
                                className="relative h-[460px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/40 border border-neutral-800 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]"
                            >
                                {article.urlToImage && (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-xs text-slate-300">
                                        {article.source?.name && (
                                            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                                                {article.source.name}
                                            </span>
                                        )}
                                        {article.publishedAt && (
                                            <span>
                                                {new Date(article.publishedAt).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                        {article.title}
                                    </h2>
                                    {article.description && (
                                        <p className="text-sm md:text-base text-slate-300 line-clamp-3 max-w-3xl">
                                            {article.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Opportunities Carousel */}
            <div className="flex flex-col gap-4 px-12 mt-4">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Nissan Innovation Projects</h3>
                        <p className='text-sm text-slate-400'>12 automotive industry opportunities worth exploring</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollOppLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll opportunities left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollOppRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll opportunities right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={oppCarouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Opportunities carousel"
                >
                    {projectData.map((o) => (
                        <div
                            key={o.title}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <OpportunityMedia videoUrl={o.videoUrl} imageUrl={o.imageUrl} title={o.title} />
                            <div className="p-5">
                                <div className="text-xl font-semibold leading-tight">{o.title}</div>
                                <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-3">{o.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Counter-intuitive Audiences */}
            <div className="flex flex-col gap-4 px-12 mt-8">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Counter-intuitive Audiences</h3>
                        <p className='text-sm text-slate-400'>Unexpected segments that over-index.</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollCounterLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll counter-intuitive audiences left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollCounterRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll counter-intuitive audiences right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={counterCarouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Counter-intuitive audiences carousel"
                >
                    {counterAudiences.map((p) => (
                        <div
                            key={p.name}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <p className="mt-1 text-sm text-neutral-400 line-clamp-3">{p.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nissan Industry News */}
            {nissanNews.length > 1 && (
                <div className='flex flex-col gap-4 px-12 mt-12'>

                    {/* Title */}
                    <div className='flex flex-col mb-2'>
                        <h3 className="text-xl font-bold">Nissan Industry Insights</h3>
                        <p className='text-sm text-slate-400'>Latest developments in automotive innovation and sustainable mobility.</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {nissanNews.map((article) => (
                            <div key={article.title} className="bg-neutral-900/60 p-4 rounded-lg shadow-2xl shadow-black/40 flex gap-3 border border-neutral-800 items-center justify-center transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer">
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="aspect-square h-28 w-28 object-cover rounded-lg border border-neutral-700" />
                                )}
                                <div className='flex flex-col gap-2 overflow-hidden'>
                                
                                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">

                                        {/* Source */}
                                        {article.source?.name && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                                                {article.source.name}
                                            </span>
                                        )}

                                        {/* Time */}
                                        {article.publishedAt && (
                                            <span>{formatTimeAgo(article.publishedAt)}</span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-md font-semibold line-clamp-2">{article.title}</h4>

                                    {/* Description */}
                                    {article.description && (
                                        <p className="text-sm text-neutral-400 line-clamp-3">{article.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EV Pioneers Section */}
            <div className="flex flex-col gap-4 px-12 mt-12">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">EV Pioneers & Innovators</h3>
                        <p className='text-sm text-slate-400'>Visionary leaders driving the electric vehicle revolution.</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollEvPioneersLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll EV pioneers left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollEvPioneersRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll EV pioneers right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={evPioneersRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="EV pioneers carousel"
                >
                    {[
                        { name: 'Tesla Visionaries', summary: 'Early adopters who embraced electric mobility and renewable energy integration.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Nissan Leaf Pioneers', summary: 'First-generation EV owners who proved electric vehicles could be practical daily drivers.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Charging Network Builders', summary: 'Infrastructure developers creating the backbone of electric vehicle adoption.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Battery Technology Researchers', summary: 'Scientists advancing energy density and charging speed for next-gen EVs.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Autonomous Driving Engineers', summary: 'Software developers creating the brains behind self-driving electric vehicles.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Sustainable Material Innovators', summary: 'Designers using recycled and eco-friendly materials in vehicle construction.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Grid Integration Specialists', summary: 'Energy experts connecting EVs to renewable power systems and smart grids.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Urban Mobility Planners', summary: 'City designers integrating electric vehicles into sustainable transportation networks.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Motorsport EV Teams', summary: 'Racing engineers pushing electric vehicle performance to new limits.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Policy Advocates', summary: 'Government and NGO leaders advancing electric vehicle adoption through legislation.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Fleet Conversion Leaders', summary: 'Business executives transitioning corporate fleets to electric vehicles.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                        { name: 'Consumer Education Champions', summary: 'Influencers and educators demystifying electric vehicle technology for mainstream adoption.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' },
                    ].map((p) => (
                        <div
                            key={p.name}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <p className="mt-1 text-sm text-neutral-400 line-clamp-3">{p.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Persona Carousel */}
            <div className="flex flex-col gap-4 px-12 mt-12">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Explore Audiences</h3>
                        <p className='text-sm text-slate-400'>Explore profiles with these audiences</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll personas left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll personas right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={carouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Persona carousel"
                >
                    {personas.map((p) => (
                        <div
                            key={p.name}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <p className="mt-1 text-sm text-neutral-400 line-clamp-3">{p.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Motorsport Venues Carousel */}
            <div className="flex flex-col gap-4 px-12 mt-8">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Motorsport Venues & Tracks</h3>
                        <p className='text-sm text-slate-400'>Iconic racing circuits and automotive event spaces.</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollStadiumLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll motorsport venues left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollStadiumRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll motorsport venues right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={stadiumCarouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Motorsport venues carousel"
                >
                    {/* Motorsport Venues */}
                    {[
                        { name: 'Circuit de Monaco', summary: 'Historic street circuit through Monte Carlo\'s glamorous streets.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Silverstone Circuit', summary: 'Home of British motorsport and Formula 1 heritage.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Nürburgring', summary: 'Germany\'s legendary "Green Hell" with the iconic Nordschleife.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Suzuka Circuit', summary: 'Japan\'s figure-eight layout hosting F1 and Super GT races.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Daytona International Speedway', summary: 'Florida\'s high-banked oval and sports car racing mecca.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Le Mans Circuit', summary: '24-hour endurance racing at Circuit de la Sarthe.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Mount Panorama', summary: 'Australia\'s Bathurst mountain circuit with elevation changes.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Interlagos', summary: 'São Paulo\'s anti-clockwise F1 circuit with passionate fans.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Red Bull Ring', summary: 'Austrian Alps circuit with stunning mountain backdrop.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Fuji Speedway', summary: 'Japan\'s high-speed circuit near Mount Fuji.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Laguna Seca', summary: 'California\'s iconic corkscrew turn and elevation changes.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Spa-Francorchamps', summary: 'Belgium\'s Ardennes forest circuit with Eau Rouge.', imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
                    ].map((s) => (
                        <div
                            key={s.name}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="text-lg font-semibold">{s.name}</div>
                                <p className="mt-1 text-sm text-neutral-400 line-clamp-3">{s.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nissan Innovation Showcase */}
            {nissanNews.length > 7 && (
                <div className="px-12 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nissanNews.slice(7, 9).map((article) => (
                            <div
                                key={article.title}
                                onClick={() => window.open(article.url, '_blank')}
                                className="relative h-[360px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/40 border border-neutral-800 hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-200 ease-out"
                            >
                                {article.urlToImage && (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                        {article.source?.name && (
                                            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                                                {article.source.name}
                                            </span>
                                        )}
                                        {article.publishedAt && (
                                            <span>{formatTimeAgo(article.publishedAt)}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight">
                                        {article.title}
                                    </h3>
                                    {article.description && (
                                        <p className="text-sm text-slate-300 line-clamp-3 max-w-2xl">
                                            {article.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Powerful audiences */}
            <div className="flex flex-col gap-4 px-12 mt-12 mb-16">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Powerful audiences</h3>
                        <p className='text-sm text-slate-400'>High-impact segments worth prioritizing.</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollPowerfulLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll powerful audiences left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollPowerfulRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll powerful audiences right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={powerfulCarouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Powerful audiences carousel"
                >
                    {(personas.slice(0, 12)).map((p) => (
                        <div
                            key={`powerful-${p.name}`}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <div className="h-40 w-full overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <p className="mt-1 text-sm text-neutral-400 line-clamp-3">{p.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home;
