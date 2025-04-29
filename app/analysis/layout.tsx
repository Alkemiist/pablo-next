import { ReactNode } from 'react';
import type { Metadata } from 'next';
import TopBar from '../components/global/top-bar/top-bar';
export const metadata: Metadata = {
    title: 'Analysis',
    description: 'Analysis page',
}

export default function AnalysisLayout( { children }: { children: ReactNode } ) {
    
    return (
        <div className="flex flex-col h-screen">

            <TopBar />

            <main className="flex-1 overflow-y-auto p-4">
                {children}
            </main>

        </div>
    )

}