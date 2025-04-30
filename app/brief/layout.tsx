

// imports
import { ReactNode } from 'react';
import Button from '../components/ui/button/button';

interface BriefLayoutProps {
    children: ReactNode;
}

export default function BriefLayout( { children }: BriefLayoutProps ) {
    return (
        <div>
            {children}
        </div>
    )
}