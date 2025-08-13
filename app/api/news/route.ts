
// imports
import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/get-news";

// Lightweight fallback payload used when NEWS_API_KEY is missing or upstream fails
const FALLBACK_NEWS = {
    articles: [
        {
            title: "Design systems quietly reshape product velocity",
            description: "Teams adopting mature design systems are shipping faster with fewer regressions, a new survey suggests.",
            urlToImage: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/design-systems-velocity",
            source: { name: "Example Daily" },
            publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
            title: "AI chips push the edge: compact models deploy offline",
            description: "Smaller models and new silicon enable privacy-first on-device inference for common tasks.",
            urlToImage: "https://images.pexels.com/photos/5380658/pexels-photo-5380658.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/edge-ai-compact-models",
            source: { name: "Tech Brief" },
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Urban athletics brands embrace micro-events",
            description: "Community-led pop-ups drive authentic engagement and first-party data collection.",
            urlToImage: "https://images.pexels.com/photos/5325586/pexels-photo-5325586.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/micro-events-urban-athletics",
            source: { name: "Market Pulse" },
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Sustainability pivots from claims to proofs",
            description: "Lifecycle proofs and product passports move mainstream as regulators tighten.",
            urlToImage: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/sustainability-proofs",
            source: { name: "Eco Ledger" },
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Remote work tools shift to async-first patterns",
            description: "Teams reduce meeting load with structured updates and well-designed handoffs.",
            urlToImage: "https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/async-first-patterns",
            source: { name: "Ops Weekly" },
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Wellness goes modular: stackable routines rise",
            description: "Short, composable routines help adherence across fitness and mindfulness.",
            urlToImage: "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/modular-wellness",
            source: { name: "Health Note" },
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Creators adopt low-lift formats for consistency",
            description: "Batching and templatized segments reduce friction without sacrificing authenticity.",
            urlToImage: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/low-lift-creator-formats",
            source: { name: "Creator Desk" },
            publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "College tours reboot with interactive demos",
            description: "Hands-on experiences and portable labs engage prospective students.",
            urlToImage: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/interactive-college-tours",
            source: { name: "Campus Wire" },
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Street food collabs spark micro-branding",
            description: "Limited-run menus become testbeds for flavor and identity.",
            urlToImage: "https://images.pexels.com/photos/239975/pexels-photo-239975.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/street-food-collabs",
            source: { name: "Food Lab" },
            publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Analog workflows return for digital originality",
            description: "Film and manual processes shape distinct creative signatures.",
            urlToImage: "https://images.pexels.com/photos/682926/pexels-photo-682926.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/analog-for-originality",
            source: { name: "Culture Scan" },
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Gamers blend IRL and online with community nights",
            description: "Hybrid formats deepen bonds and broaden participation.",
            urlToImage: "https://images.pexels.com/photos/9072313/pexels-photo-9072313.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/hybrid-gaming-nights",
            source: { name: "Playbook" },
            publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: "Art walks evolve into neighborhood runways",
            description: "Local arts ecosystems drive foot traffic and discovery.",
            urlToImage: "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=1200",
            url: "https://example.com/art-walk-runways",
            source: { name: "Arts Note" },
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
    ],
};

// get the news
export async function GET(request: Request) {

    // get the api key from the environment variables
    const apiKey = process.env.NEWS_API_KEY;

    // Debug logging
    console.log('🔍 Debug: API Key exists:', !!apiKey);
    console.log('🔍 Debug: API Key length:', apiKey ? apiKey.length : 0);
    console.log('🔍 Debug: API Key starts with:', apiKey ? apiKey.substring(0, 8) + '...' : 'N/A');
    console.log('🔍 Debug: API Key format check:', apiKey ? /^[a-f0-9]{32}$/.test(apiKey) : 'N/A');

    // API error handling
    if ( !apiKey ) {
        console.warn("NEWS_API_KEY is not set. Serving fallback news payload.");
        return NextResponse.json(FALLBACK_NEWS, { status: 200 });
    }

    // try and catch 
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || undefined;
        const query = searchParams.get('q') || undefined;
        const pageSizeParam = searchParams.get('pageSize');
        const country = searchParams.get('country') || undefined;
        const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined;

        const news = await fetchNews(apiKey, { category, query, pageSize, country });
        return NextResponse.json(news);
    } catch (error) {
        console.error('News API Error:', error);
        console.warn("Upstream news fetch failed. Serving fallback news payload.");
        return NextResponse.json(FALLBACK_NEWS, { status: 200 });
    }
}