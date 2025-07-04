
// imports
import { SentimentBar } from "@/app/components/ui/sentiment-bar/sentiment-bar"; 
import { AnalysisCard } from "@/app/components/ui/analysis-card/analysis.card";

export default function SentimentPage() {

    // work area

    // return component 
    return (

        <div className="ml-1 h-[calc(100vh-60px)]">
            <SentimentBar />
            <div className="flex flex-wrap justify-between gap-6 mt-4 mx-4">
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
                <AnalysisCard />
            </div>
        </div>
    )

}