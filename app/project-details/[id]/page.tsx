'use client';

// imports
import { getProjectData } from '@/lib/project-data';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, Building, Package, MoreVertical, Share, Bookmark } from 'lucide-react';

// project interface: This is the data that is pulled from the file now ( database later )
interface Project {
    id: number;
    title: string;
    cardDescription: string;
    fullDescription: string;
    brand: string;
    product: string;
    persona: string;
    budget: number;
    timelineStart: string;
    timelineEnd: string;
    trend: string;
    cta: string;
    videoUrl: string;
}

// project details page: This is the page that displays the project details as soon as the data is pulled.
export default function ProjectDetails() {
    // state
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const projectId = parseInt(params.id as string);

    // fetch project data when component mounts
    useEffect(() => {
        if (projectId) {
            const foundProject = getProjectData.find(p => p.id === projectId);
            setProject(foundProject || null);
            setLoading(false);
        }
    }, [projectId]);

    // loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-2xl font-bold text-neutral-400">Loading...</div>
            </div>
        );
    }

    // project not found
    if (!project) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-neutral-400 mb-4">Project Not Found</h1>
                    <Link 
                        href="/" 
                        className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }


    // project found UI: This is the UI that displays the project details as soon as the data is pulled.
    return (
        <div className="min-h-screen bg-neutral-950 text-white">

            {/* Header */}
            <div className="border-b bg-neutral-950 border-neutral-800 sticky top-0 z-10 shadow-2xl shadow-black/40">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/"
                                className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            
                        </div>
                        <div>
                        <div className="flex items-center gap-4 justify-center">
                                <h1 className="text-2xl font-bold">{project.title}</h1>
                                {/* <p className="text-neutral-400">{project.brand} • {project.product}</p> */}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="bg-blue-600 hover:bg-blue-500 px-12 cursor-pointer text-white font-semibold text-sm py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]">
                                Interested
                            </button>
                            <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                                <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer">
                                <Share className="h-4 w-4" />
                            </button>
                            {/* <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                                <MoreVertical className="h-5 w-5" />
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Video Section */}
            <div className="">
                <div className="bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl shadow-black/40">
                    {project.videoUrl ? (
                        <video
                            className="w-full h-[500px] object-cover"
                            src={project.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="/Image-card.png"
                        />
                    ) : (
                        <img 
                            src="/Image-card.png" 
                            alt={project.title}
                            className="w-full h-[500px] object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                {/* Project Stats */}
                <div className="p-6 flex gap-4 flex-col md:flex-row">

                                {/* Brand */}
                                <div className="flex flex-1 justify-center items-center gap-3 border border-neutral-800 p-2 rounded-2xl bg-neutral-900/40 shadow-2xl shadow-black/40">
                                    {/* <Building className="h-5 w-5 text-neutral-400" /> */}
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-neutral-400">Brand</p>
                                        <p className="font-medium text-white">{project.brand}</p>
                                    </div>
                                </div>
                                
                                {/* Product */}
                                <div className="flex flex-1 items-center justify-center gap-3 border border-neutral-800 p-4 rounded-2xl bg-neutral-900/40 shadow-2xl shadow-black/40">
                                    {/* <Package className="h-5 w-5 text-neutral-400" /> */}
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-neutral-400">Product</p>
                                        <p className="font-medium text-white">{project.product}</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="flex flex-1 items-center justify-center gap-3 border border-neutral-800 p-4 rounded-2xl bg-neutral-900/40 shadow-2xl shadow-black/40">
                                    {/* <Calendar className="h-5 w-5 text-neutral-400" /> */}
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-neutral-400">Timeline</p>
                                        <p className="font-medium text-white">{project.timelineStart} through {project.timelineEnd}</p>
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="flex flex-1 items-center justify-center gap-3 border border-neutral-800 p-4 rounded-2xl bg-neutral-900/40 shadow-2xl shadow-black/40">
                                    {/* <DollarSign className="h-5 w-5 text-neutral-400" /> */}
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm text-neutral-400">Budget</p>
                                        <p className="font-medium text-white">${project.budget.toLocaleString()}</p>
                                    </div>
                                </div>

                        </div>

                {/* Project Description */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Project Description</h2>
                    <p className="text-neutral-400 leading-relaxed ">{project.fullDescription}</p>
                </div>

                {/* Target Persona */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Target Persona</h2>
                    <p className="text-neutral-400 leading-relaxed">{project.persona}</p>
                </div>

                {/* Market Trend */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Market Trend</h2>
                    <p className="text-neutral-400 leading-relaxed">{project.trend}</p>
                </div>

            </div>
        </div>
    );
}
