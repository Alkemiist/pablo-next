// imports
import { ReactNode } from 'react';
import { GenBriefProviderFunc } from '../context/gen-brief-context';

// props type
interface genBriefLayoutProps {
    children: ReactNode;
}

// create the layout
export default function GenBriefLayout( { children }: genBriefLayoutProps ) {
    return (
        <div>
            <GenBriefProviderFunc>
                { children }
            </GenBriefProviderFunc>
        </div>
    )
}