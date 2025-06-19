// imports
import * as React from "react";

interface ProfileAnalysisLayoutProps {      
    children: React.ReactNode;
}

export default function ProfileAnalysisLayout({ children }: ProfileAnalysisLayoutProps) {
    return (
        <div className="">
            {children}
        </div>
    )
}