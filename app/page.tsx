'use client';

// imports
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { getProjectData } from '@/lib/project-data';


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
    

    
    // persona cards interface
    type PersonaCard = {
        name: string;
        summary: string;
        imageUrl: string;
    };

    // persona rows
    const personas: PersonaCard[] = useMemo(
        () => [
            {
                name: 'Urban Athletes',
                summary:
                    'An urban sports enthusiast with a streetwear style, balancing athleticism and cultural vibrancy in daily life.',
                imageUrl:
                    'https://images.pexels.com/photos/5325586/pexels-photo-5325586.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Tech Explorers',
                summary:
                    'Curious early adopters who experiment with the latest tools, apps, and devices to optimize modern life.',
                imageUrl:
                    'https://images.pexels.com/photos/5380658/pexels-photo-5380658.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Eco Minimalists',
                summary:
                    'Sustainability-first consumers who value low-impact choices, timeless design, and purposeful living.',
                imageUrl:
                    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Creative Makers',
                summary:
                    'Hands-on creators who love crafting, prototyping, and turning ideas into tangible projects.',
                imageUrl:
                    'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Remote Nomads',
                summary:
                    'Fully mobile professionals building careers from anywhere—cafés, cabins, and co-working spaces.',
                imageUrl:
                    'https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Wellness Seekers',
                summary:
                    'Holistic health enthusiasts who prioritize movement, mindfulness, and balanced daily rituals.',
                imageUrl:
                    'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Gamer Strategists',
                summary:
                    'Competitive players who value teamwork, precision, and high-performance hardware and setups.',
                imageUrl:
                    'https://images.pexels.com/photos/791543/pexels-photo-791543.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Food Adventurers',
                summary:
                    'Explorers of new flavors, pop-ups, and street food—always chasing the next great bite.',
                imageUrl:
                    'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Pet Parents',
                summary:
                    'Compassionate caretakers who weave pet health, training, and enrichment into home life.',
                imageUrl:
                    'https://images.pexels.com/photos/4588044/pexels-photo-4588044.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Finance Optimizers',
                summary:
                    'Budget-savvy planners focused on tools, habits, and education for long-term financial health.',
                imageUrl:
                    'https://images.pexels.com/photos/4968633/pexels-photo-4968633.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Home Improvers',
                summary:
                    'DIY renovators who turn living spaces into highly functional, beautiful environments.',
                imageUrl:
                    'https://images.pexels.com/photos/6474479/pexels-photo-6474479.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
                name: 'Culture Curators',
                summary:
                    'Avid museum-goers and scene trackers collecting music, art, and experiences worth sharing.',
                imageUrl:
                    'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
        ],
        []
    );

    // Projects / Opportunities section 
const projectData = [

    {
        title: 'Hosting a Dinner',
        description:
            'Create an intimate, high-touch experience with curated menus and ambience for meaningful connection.',
        imageUrl:
            'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
        title: 'Pop-up Retail',
        description:
            'Short-term storefront to test products, gather feedback, and spark local buzz.',
        imageUrl:
            'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        title: 'Workshop Series',
        description:
            'Hands-on learning that positions your brand as an expert and builds community.',
        imageUrl:
            'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    {
        title: 'Creator Collaboration',
        description:
            'Partner with aligned creators to co-design products and reach new audiences.',
        imageUrl:
            'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    {
        title: 'Limited Edition Drop',
        description:
            'Time-bound releases to drive urgency and deepen brand lore.',
        imageUrl:
            'https://images.pexels.com/photos/5717511/pexels-photo-5717511.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
        title: 'Community Clean-up',
        description:
            'Purpose-driven activation that mobilizes locals and earns goodwill.',
        imageUrl:
            'https://images.pexels.com/photos/6646914/pexels-photo-6646914.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
    {
        title: 'Campus Tour',
        description:
            'Meet Gen Z where they are with on-campus sampling and experiences.',
        imageUrl:
            'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    },
    {
        title: 'IRL Gaming Night',
        description:
            'Hybrid tournament and lounge experience to connect gamers and casual players.',
        imageUrl:
            'https://images.pexels.com/photos/9072313/pexels-photo-9072313.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
        title: 'Wellness Pop-in',
        description:
            'Breathwork, stretch, and recovery stations at offices and co-working spaces.',
        imageUrl:
            'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
        title: 'Neighborhood Art Walk',
        description:
            'Showcase local artists and transform streets into cultural runways.',
        imageUrl:
            'https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    },
    {
        title: 'Food Truck Collab',
        description:
            'Co-branded menu items to trial flavors and drive social content.',
        imageUrl:
            'https://images.pexels.com/photos/239975/pexels-photo-239975.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    },
    {
        title: 'After-hours Museum Night',
        description:
            'Immersive culture-first event that pairs your brand with rare access.',
        imageUrl:
            'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    
    
]

    const counterAudiences: PersonaCard[] = useMemo(
        () => [
            { name: 'Unlikely Luxury Shoppers', summary: 'Value-seekers who splurge on signature pieces when the story resonates.', imageUrl: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Rural Tech Tinkerers', summary: 'DIY hardware modders upgrading gear off-the-grid.', imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Night-Shift Athletes', summary: 'Train after midnight; shop for recovery and performance aids.', imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Finance Meme Traders', summary: 'Retail traders who treat markets as community and game.', imageUrl: 'https://images.pexels.com/photos/6801872/pexels-photo-6801872.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Vintage Camera Newbies', summary: 'Gen Z creators learning analog workflows for originality.', imageUrl: 'https://images.pexels.com/photos/682926/pexels-photo-682926.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Suburban Sneakerheads', summary: 'High-heat collectors outside the usual urban drops.', imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Remote Van-Lifers', summary: 'Work-from-anywhere nomads optimizing compact living.', imageUrl: 'https://images.pexels.com/photos/2168974/pexels-photo-2168974.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Studio Apartment Chefs', summary: 'Max flavor with minimal space—gear matters.', imageUrl: 'https://images.pexels.com/photos/4109993/pexels-photo-4109993.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Alumni Superfans', summary: 'Graduates who still road-trip for games and merch.', imageUrl: 'https://images.pexels.com/photos/792254/pexels-photo-792254.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Pet Fashion Buyers', summary: 'Owners who buy matching fits and lifestyle accessories.', imageUrl: 'https://images.pexels.com/photos/573186/pexels-photo-573186.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'Weekend Biologists', summary: 'Amateur naturalists who invest in field and lab kits.', imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800' },
            { name: 'City Cyclists Without Cars', summary: 'Two wheels only; prioritize maintenance and safety tech.', imageUrl: 'https://images.pexels.com/photos/210095/pexels-photo-210095.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ],
        []
    );

    const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // opportunity media component
    const OpportunityMedia = ({ videoUrl, imageUrl, title }: { videoUrl?: string; imageUrl?: string; title: string }) => {
        const [useImage, setUseImage] = useState(false);
        const posterSrc = imageUrl || '/Image-card.png';
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
                ) : (
                    <img src={posterSrc} alt={title} className="h-full w-full object-cover" />
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

    // opportunity cards
    
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
            

            {/* Top Hero (single feature) */}
            {news.length > 0 && (
                <div className="px-12 mt-8 mb-8">
                    {(() => {
                        const article = news[0];
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
                        <h3 className="text-xl font-bold">Projects for you</h3>
                        <p className='text-sm text-slate-400'>12 activation ideas worth exploring</p>
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
                    {getProjectData.map((o) => (
                        <div
                            key={o.title}
                            className="shrink-0 w-[300px] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
                        >
                            <OpportunityMedia videoUrl={o.videoUrl} title={o.title} />
                            <div className="p-5">
                                <div className="text-xl font-semibold leading-tight">{o.title}</div>
                                <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-3">{o.cardDescription}</p>
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

            {/* Stories we love */}
            {news.length > 1 && (
                <div className='flex flex-col gap-4 px-12 mt-12'>

                    {/* Title */}
                    <div className='flex flex-col mb-2'>
                        <h3 className="text-xl font-bold">Trends we love</h3>
                        <p className='text-sm text-slate-400'>Curated highlights across {debouncedQuery ? 'your search' : category}.</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {news.slice(3, 9).map((article) => (
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

            {/* Stadiums Carousel */}
            <div className="flex flex-col gap-4 px-12 mt-8">
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <h3 className="text-xl font-bold">Stadiums with similar audiences</h3>
                        <p className='text-sm text-slate-400'>Global venues and arenas.</p>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={scrollStadiumLeft}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll stadiums left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={scrollStadiumRight}
                            className="h-9 w-9 grid place-items-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                            aria-label="Scroll stadiums right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div
                    ref={stadiumCarouselRef}
                    className="relative flex gap-4 overflow-x-auto scroll-smooth pr-2 scroll-container"
                    aria-label="Stadiums carousel"
                >
                    {[
                        { name: 'Wembley Stadium', summary: 'Iconic London venue known for major finals and concerts.', imageUrl: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Camp Nou', summary: 'Home of FC Barcelona with a storied European history.', imageUrl: 'https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Santiago Bernabéu', summary: 'Real Madrid’s legendary ground undergoing modernization.', imageUrl: 'https://images.pexels.com/photos/258187/pexels-photo-258187.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Allianz Arena', summary: 'Munich’s luminous arena famed for its facade.', imageUrl: 'https://images.pexels.com/photos/290938/pexels-photo-290938.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'San Siro', summary: 'Historic Milan stadium shared by AC Milan and Inter.', imageUrl: 'https://images.pexels.com/photos/167979/pexels-photo-167979.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Old Trafford', summary: 'Theatre of Dreams, home of Manchester United.', imageUrl: 'https://images.pexels.com/photos/1799983/pexels-photo-1799983.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'MetLife Stadium', summary: 'New Jersey venue hosting NFL and major events.', imageUrl: 'https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'AT&T Stadium', summary: 'Arlington’s massive, tech-forward NFL stadium.', imageUrl: 'https://images.pexels.com/photos/1322186/pexels-photo-1322186.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Maracanã', summary: 'Rio’s legendary football cathedral.', imageUrl: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Signal Iduna Park', summary: 'Dortmund’s famous Yellow Wall atmosphere.', imageUrl: 'https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Stade de France', summary: 'National stadium of France in Saint-Denis.', imageUrl: 'https://images.pexels.com/photos/258187/pexels-photo-258187.jpeg?auto=compress&cs=tinysrgb&w=800' },
                        { name: 'Lusail Stadium', summary: 'Showcase venue from the Qatar World Cup.', imageUrl: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800' },
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

            {/* Latest grid removed as requested */}
            {news.length > 10 && (
                <div className="px-12 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {news.slice(9, 11).map((article) => (
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
                                            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                                                {article.source.name}
                                            </span>
                                        )}
                                        {article.publishedAt && (
                                            <span>{new Date(article.publishedAt).toLocaleString()}</span>
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