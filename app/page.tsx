'use client';

// imports
import { useEffect, useState } from 'react';

// this is the home component
function Home() {
    
    // state
    const [ news, setNews ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // fetch the news
    useEffect( () => {

        const fetchNews = async () => {

            try {
                // fetch the news
                const response = await fetch('/api/news');
                const data = await response.json();

                // set the news
                setNews(data.articles || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        }

        // fetch the news
        fetchNews();

    }, []);

    // loading
    if ( loading ) {
        return <div className="text-2xl font-bold">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-screen">

            {/* Hero Section: First article */}
            <div onClick={() => window.open(news[0].url, '_blank')} className="flex flex-col gap-4 px-12 mt-12 relative">
                <div className="w-full h-full">
                    <img src={news[0].urlToImage} alt={news[0].title} className="w-full h-96 object-cover rounded-md" />
                </div>
                <div className="w-full absolute bottom-0 left-0 px-16 py-8 ">
                    <h2 className="text-2xl font-bold">{news[0].title}</h2>
                    <p className="text-sm text-slate-400 line-clamp-3">{news[0].description}</p>
                </div>
            </div>

            {/* Stories we love: 6 stories 3x2 */}
            <div className="grid grid-cols-3 gap-4 px-12 mt-12">
                {news.slice(1, 7).map((article: any) => (
                    <div key={article.title} className="bg-slate-900 p-4 rounded-lg shadow-md flex flex-col gap-2">
                        <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md" />
                        <h2 className="text-lg font-bold line-clamp-2">{article.title}</h2>
                        <p className="text-sm text-slate-400 line-clamp-3">{article.description}</p>
                    </div>
                ))}
            </div>

            {/* News Articles */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-12">
                {news.map((article: any) => (
                    <div key={article.title} className="bg-slate-900 p-4 rounded-lg shadow-md flex flex-col gap-2">
                        <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md" />
                        <h2 className="text-lg font-bold line-clamp-2">{article.title}</h2>
                        <p className="text-sm text-slate-400 line-clamp-3">{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Read More</a>
                    </div>
                ))}
            </div> */}


        </div>
    )
}

export default Home;