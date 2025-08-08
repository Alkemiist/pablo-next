export type NewsQueryOptions = {
    category?: string;
    query?: string;
    pageSize?: number;
    country?: string;
};

export const fetchNews = async (apiKey: string, options: NewsQueryOptions = {}) => {
    const {
        category,
        query,
        pageSize = 20,
        country = 'us',
    } = options;

    const baseUrl = query
        ? 'https://newsapi.org/v2/everything'
        : 'https://newsapi.org/v2/top-headlines';

    const params = new URLSearchParams();

    if (query) {
        params.set('q', query);
        params.set('language', 'en');
        params.set('sortBy', 'publishedAt');
    } else {
        params.set('country', country);
        if (category) params.set('category', category);
    }

    params.set('pageSize', String(pageSize));
    params.set('apiKey', apiKey);

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}