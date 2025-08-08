
// imports
import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/get-news";

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
        return NextResponse.json({ error: "API key is not set" }, { status: 500 });
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
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}