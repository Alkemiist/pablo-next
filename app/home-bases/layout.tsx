
// imports
import IntelligenceTopBar from '@/app/components/global/intelligence-top-bar';

// props
interface HomeBasesLayoutProps {
    children: React.ReactNode;
}


// layout
export default function HomeBasesLayout({ children }: HomeBasesLayoutProps) {
    return (
        <div>
            <IntelligenceTopBar />
            {children}
        </div>
    )
}