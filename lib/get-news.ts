

export const fetchNews = async (apiKey: string) => {

    // variables 
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    const response = await fetch(url);

    // error handling
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    // parse the response
    const data = await response.json();

    // return the data
    return data;

}