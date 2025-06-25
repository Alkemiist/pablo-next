"use client"

// imports
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AnalysisTopBar from "@/app/components/ui/analysis-top-bar/analysis-top-bar";

interface ProfileAnalysisLayoutProps {      
    children: React.ReactNode;
}

export default function ProfileAnalysisLayout({ children }: ProfileAnalysisLayoutProps) {

    return (
        <div className="">
            <AnalysisTopBar />
            {children}
        </div>
    )
}