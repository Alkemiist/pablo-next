
// imports
import IntelligenceTopBar from "@/app/components/global/intelligence-top-bar"

interface IntelligenceLayoutProps {
    children: React.ReactNode
}

export default function IntelligenceLayout({ children }: IntelligenceLayoutProps) {

    return (
        <div className="bg-slate-950">
            <IntelligenceTopBar />
            {children}
        </div>
    )
}