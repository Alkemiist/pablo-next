'use client';

// imports
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

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

    const categories = useMemo(
        () => [
            'general',
            'business',
            'entertainment',
            'health',
            'science',
            'sports',
            'technology',
        ],
        []
    );

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

    // search debounce
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
            {/* Filters/Search Bar */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
                <div className="px-12 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pr-2 [-ms-overflow-style:none] [scrollbar-width:none]">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-3 py-1 rounded-lg cursor-pointer text-sm border transition-colors ${
                                    category === c && !debouncedQuery
                                        ? 'bg-white text-slate-900 border-white'
                                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                                }`}
                                disabled={!!debouncedQuery}
                                title={debouncedQuery ? 'Clear search to use categories' : `Top ${c}`}
                            >
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-64 md:w-96 ml-auto shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search topics, companies, or keywords..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-12 py-2 outline-none focus:ring-2 focus:ring-slate-600"
                            aria-label="Search news"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            {news.length > 0 && (
                <div className="px-12 mt-8">
                    <div
                        onClick={() => window.open(news[0].url, '_blank')}
                        className="relative h-[420px] w-full rounded-xl overflow-hidden cursor-pointer group"
                    >
                        {/* Image */}
                        {news[0].urlToImage && (
                            <img
                                src={news[0].urlToImage}
                                alt={news[0].title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        )}
                        {/* Gradient overlay for contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                        {/* Copy */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                {news[0].source?.name && (
                                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                                        {news[0].source.name}
                                    </span>
                                )}
                                {news[0].publishedAt && (
                                    <span>
                                        {new Date(news[0].publishedAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                {news[0].title}
                            </h2>
                            {news[0].description && (
                                <p className="text-sm md:text-base text-slate-300 line-clamp-3 max-w-3xl">
                                    {news[0].description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Stories we love */}
            {news.length > 1 && (
                <div className='flex flex-col gap-4 px-12 mt-12'>

                    {/* Title */}
                    <div className='flex flex-col mb-2'>
                        <h3 className="text-xl font-bold">Stories we love</h3>
                        <p className='text-sm text-slate-400'>Curated highlights across {debouncedQuery ? 'your search' : category}.</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {news.slice(1, 7).map((article) => (
                            <div key={article.title} className="bg-slate-900 p-4 rounded-lg shadow-md flex gap-3 border border-slate-800 items-center justify-center">
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="aspect-square h-28 w-28 object-cover rounded-lg border border-slate-700" />
                                )}
                                <div className='flex flex-col gap-2 overflow-hidden'>
                                
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">

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
                                        <p className="text-sm text-slate-400 line-clamp-3">{article.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Latest grid */}
            {news.length > 7 && (
                <div className='flex flex-col gap-4 px-12 mt-12 mb-16'>
                    <div className='flex items-center justify-between mb-2'>
                        <div>
                            <h3 className="text-xl font-bold">Latest</h3>
                            <p className='text-sm text-slate-400'>Fresh headlines updated in real-time.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {news.slice(7, 23).map((article) => (
                            <div
                                key={article.title}
                                onClick={() => window.open(article.url, '_blank')}
                                className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden cursor-pointer hover:ring-1 hover:ring-slate-600 transition-shadow"
                            >
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="h-40 w-full object-cover" />
                                )}
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        {article.source?.name && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                                                {article.source.name}
                                            </span>
                                        )}
                                        {article.publishedAt && (
                                            <span>{formatTimeAgo(article.publishedAt)}</span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-semibold line-clamp-2 min-h-[40px]">{article.title}</h4>
                                    {article.description && (
                                        <p className="text-xs text-slate-400 line-clamp-3">{article.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home;