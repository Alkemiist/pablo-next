
// imports
import { SentimentBar } from "@/app/components/ui/sentiment-bar/sentiment-bar"; 
import { AnalysisCard } from "@/app/components/ui/analysis-card/analysis.card";
import { sentimentCardData } from "@/lib/sentiment-card-data";
import { ChartLineDots } from "@/app/components/ui/sentiment-card-chart/sentiment-card-chart";

export default function SentimentPage() {

    // work area


    // return component 
    return (

        <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto">

            {/* Sentiment Bar */}
            <SentimentBar />

            {/* Analysis Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {sentimentCardData.map((card) => (
                    <AnalysisCard key={card.title} title={card.title} description={card.description} sentiment={card.sentiment} sentimentScore={card.sentimentScore} />
                ))}
            </div>

        </div>
    )

}