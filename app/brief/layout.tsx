

// imports
import { ReactNode } from 'react';
import BriefTopBar from '../components/global/brief-top-bar/brief-top-bar';
import { BriefProviderFunc } from '../context/briefcontext';

interface BriefLayoutProps {
    children: ReactNode;
}

export default function BriefLayout( { children }: BriefLayoutProps ) {
    return (
        
            <div className="flex flex-col gap-4 absolute top-0 left-17 right-0 bottom-0">
                <BriefProviderFunc>
                    <BriefTopBar />
                    {children}
                </BriefProviderFunc>
            </div>
        
    )
}