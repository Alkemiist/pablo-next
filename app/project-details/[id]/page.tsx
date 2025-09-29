'use client';

// imports
import { getProjectData, recommendedProfiles } from '@/lib/project-data';
import { generateCampaignAnalytics } from '@/lib/campaign-analytics';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, Building, Package, MoreVertical, Share, Bookmark, Play, Target, Lightbulb, Award, Star, CheckCircle, ArrowRight, Zap, Globe, Heart, BarChart3, PieChart, Activity, ChevronDown } from 'lucide-react';

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
    mainChannel: string;
    mainFormat: string;
    primaryKPI: string;
}

// recommended profiles interface: This is the data that is pulled from the file now ( database later )
interface RecommendedProfile {
    id: number;
    name: string;
    profilePicture: string;
    description: string;
    personaScore?: number;
    matchScore?: number;
}

// Function to generate AI-powered persona traits
async function generatePersonaTraits(persona: string): Promise<string[]> {
    try {
        const response = await fetch('/api/generate-persona-traits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ persona }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate traits');
        }

        const data = await response.json();
        return data.traits || [];
    } catch (error) {
        console.error('Error generating persona traits:', error);
        // Fallback traits if AI fails
        return [
            'Digital Native', 'Experience Seeker', 'Social Connection', 'Innovation Driven',
            'Quality Focused', 'Community Oriented', 'Tech Savvy', 'Lifestyle Driven'
        ];
    }
}

// Function to generate persona-specific images based on the project persona
function generatePersonaImages(persona: string) {
    // Analyze persona text to determine the type and generate appropriate images
    const personaLower = persona.toLowerCase();
    
    // Define image sets for different persona types
    const imageSets = {
        // Urban Explorers / City-focused personas
        urban: [
            {
                url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=faces",
                alt: "Urban Lifestyle - Young adults socializing in city park",
                label: "Urban Lifestyle"
            },
            {
                url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=faces",
                alt: "Tech Innovation - Digital content creation",
                label: "Tech Innovation"
            },
            {
                url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=faces",
                alt: "Digital Native - Mobile-first lifestyle",
                label: "Digital Native"
            },
            {
                url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=faces",
                alt: "Social Connection - Group collaboration",
                label: "Social Connection"
            },
            {
                url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=faces",
                alt: "Content Creation - Creative expression",
                label: "Content Creation"
            },
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=faces",
                alt: "Design Focus - Aesthetic lifestyle",
                label: "Design Focus"
            }
        ],
        
        // Eco Creators / Sustainability-focused personas
        eco: [
            {
                url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop&crop=faces",
                alt: "Sustainability - Eco-conscious outdoor activities",
                label: "Sustainability"
            },
            {
                url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=faces",
                alt: "Nature Connection - Outdoor lifestyle",
                label: "Nature Connection"
            },
            {
                url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=faces",
                alt: "Eco Innovation - Sustainable technology",
                label: "Eco Innovation"
            },
            {
                url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=faces",
                alt: "Community Action - Group environmental activities",
                label: "Community Action"
            },
            {
                url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=faces",
                alt: "Digital Advocacy - Online environmental content",
                label: "Digital Advocacy"
            },
            {
                url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=faces",
                alt: "Conscious Living - Mindful lifestyle choices",
                label: "Conscious Living"
            }
        ],
        
        // Cultural Seekers / Festival/Event-focused personas
        cultural: [
            {
                url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop&crop=faces",
                alt: "Music Culture - Festival and live music",
                label: "Music Culture"
            },
            {
                url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&crop=faces",
                alt: "Art & Design - Creative expression",
                label: "Art & Design"
            },
            {
                url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=faces",
                alt: "Community Events - Social gatherings",
                label: "Community Events"
            },
            {
                url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&crop=faces",
                alt: "Digital Culture - Online communities",
                label: "Digital Culture"
            },
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=faces",
                alt: "Fashion & Style - Cultural expression",
                label: "Fashion & Style"
            },
            {
                url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=faces",
                alt: "Innovation - Tech meets culture",
                label: "Innovation"
            }
        ],
        
        // Trendsetters / Fashion/Luxury-focused personas
        trendsetter: [
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=faces",
                alt: "Fashion Forward - Style and luxury",
                label: "Fashion Forward"
            },
            {
                url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&crop=faces",
                alt: "Art & Culture - Creative lifestyle",
                label: "Art & Culture"
            },
            {
                url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=faces",
                alt: "Urban Sophistication - City lifestyle",
                label: "Urban Sophistication"
            },
            {
                url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&crop=faces",
                alt: "Digital Luxury - Tech meets style",
                label: "Digital Luxury"
            },
            {
                url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=faces",
                alt: "Social Influence - Networking and connections",
                label: "Social Influence"
            },
            {
                url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=faces",
                alt: "Content Creation - Lifestyle documentation",
                label: "Content Creation"
            }
        ]
    };
    
    // Determine persona type based on keywords
    if (personaLower.includes('eco') || personaLower.includes('sustainability') || personaLower.includes('climate')) {
        return imageSets.eco;
    } else if (personaLower.includes('cultural') || personaLower.includes('festival') || personaLower.includes('music')) {
        return imageSets.cultural;
    } else if (personaLower.includes('trendsetter') || personaLower.includes('fashion') || personaLower.includes('luxury')) {
        return imageSets.trendsetter;
    } else {
        // Default to urban for most personas
        return imageSets.urban;
    }
}



// project details page: This is the page that displays the project details as soon as the data is pulled.
export default function ProjectDetails() {
    // state
    const [project, setProject] = useState<Project | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [personaTraits, setPersonaTraits] = useState<string[]>([]);
    const [traitsLoading, setTraitsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const projectId = parseInt(params.id as string);

    // fetch project data when component mounts
    useEffect(() => {
        if (projectId) {
            const foundProject = getProjectData.find(p => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
                // Generate real analytics based on project data
                const campaignAnalytics = generateCampaignAnalytics(foundProject);
                setAnalytics(campaignAnalytics);
                
                // Generate AI-powered persona traits
                setTraitsLoading(true);
                generatePersonaTraits(foundProject.persona)
                    .then(traits => {
                        setPersonaTraits(traits);
                        setTraitsLoading(false);
                    })
                    .catch(error => {
                        console.error('Failed to generate persona traits:', error);
                        setTraitsLoading(false);
                    });
            } else {
                setProject(null);
            }
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">

            {/* Header */}
            <div className="border-b bg-neutral-950/80 backdrop-blur-xl border-neutral-800 sticky top-0 z-50 shadow-2xl shadow-black/40">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/"
                                className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 justify-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">{project.title}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20">
                                <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-400/20">
                                <Share className="h-4 w-4" />
                            </button>
                            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 px-8 cursor-pointer text-white font-semibold text-sm py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105">
                                {project.cta}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-Screen Hero Video Section */}
            <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
                <div className="relative h-full w-full">
                    {project.videoUrl ? (
                        <video
                            className="w-full h-full object-cover"
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
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
                    
                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="px-3 py-1 bg-neutral-500/20 border border-neutral-500/30 rounded-full">
                                    <span className="text-neutral-400 text-sm font-medium">{project.brand}</span>
                                </div>
                                <div className="px-3 py-1 bg-neutral-500/20 border border-neutral-500/30 rounded-full">
                                    <span className="text-neutral-400 text-sm font-medium">{project.product}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white via-neutral-100 to-white bg-clip-text text-transparent">
                                    {project.title}
                                </span>
                            </h1>
                            <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-2xl">
                                {project.cardDescription}
                            </p>
                        </div>
                    </div>
                    
                    {/* Animated Chevron Arrow */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="animate-bounce">
                            <ChevronDown className="h-8 w-8 text-white/70 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                {/* Project Overview Section */}
                <div className="py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                            Project Overview
                        </h2>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                        {/* Main Project Details Container */}
                        <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-8 lg:p-12 mb-8">
                            <div className="absolute top-6 right-6 w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Project Details:</h3>
                                <p className="text-lg text-neutral-400 leading-relaxed">{project.fullDescription}</p>
                            </div>
                        </div>

                        {/* Campaign Focus and Expected Impact - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Campaign Focus */}
                            <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Campaign Focus:</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    Strategic marketing initiative designed to engage target audiences through innovative approaches and compelling storytelling.
                                </p>
                            </div>

                            {/* Expected Impact */}
                            <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Expected Impact:</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    High engagement potential with measurable results across digital platforms and target demographics.
                                </p>
                            </div>
                        </div>

                        {/* 4 Component Bricks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Brand Brick */}
                            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                                        <Building className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Brand</h3>
                                    <p className="text-xl font-bold text-white">{project.brand}</p>
                                </div>
                            </div>
                            
                            {/* Product Brick */}
                            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                                        <Package className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Product</h3>
                                    <p className="text-xl font-bold text-white">{project.product}</p>
                                </div>
                            </div>

                            {/* Timeline Brick */}
                            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                                        <Calendar className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Timeline</h3>
                                    <p className="text-lg font-bold text-white">{project.timelineStart}</p>
                                    <p className="text-sm text-neutral-400">to {project.timelineEnd}</p>
                                </div>
                            </div>

                            {/* Budget Brick */}
                            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm hover:border-neutral-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-500/20 to-neutral-600/20 border border-neutral-500/30 flex items-center justify-center">
                                        <DollarSign className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Budget</h3>
                                    <p className="text-xl font-bold text-white">${project.budget.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Target Persona Section */}
                <div className="py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                            Target Persona
                        </h2>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                        {/* Combined Persona Details and Characteristics */}
                        <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm p-8 lg:p-12">
                            <div className="absolute top-6 right-6 w-3 h-3 bg-neutral-400 rounded-full animate-pulse"></div>
                            
                            {/* Persona Description */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-white mb-4">Persona Details:</h3>
                                <p className="text-lg text-neutral-400 leading-relaxed">{project.persona}</p>
                            </div>

                            {/* Key Audience Characteristics */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-3">Key Audience Characteristics</h3>
                                <p className="text-neutral-500 text-sm max-w-2xl">
                                    AI-analyzed traits that define this target audience's behavior, values, and lifestyle patterns
                                </p>
                            </div>
                            
                            {/* AI-Generated Traits Chips */}
                            <div className="flex flex-wrap gap-3">
                                {traitsLoading ? (
                                    // Loading skeleton for traits
                                    Array.from({ length: 8 }).map((_, index) => (
                                        <div key={index} className="flex items-center gap-2 px-4 py-2 bg-neutral-500/5 border border-neutral-500/20 rounded-full animate-pulse">
                                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                                            <div className="w-20 h-4 bg-neutral-600 rounded"></div>
                                        </div>
                                    ))
                                ) : (
                                    // AI-generated traits
                                    personaTraits.map((trait, index) => (
                                        <div key={index} className="flex items-center gap-2 px-4 py-2 bg-neutral-500/10 border border-neutral-500/30 rounded-full hover:border-neutral-400/30 transition-all duration-300">
                                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
                                            <span className="text-neutral-400 text-sm font-medium">{trait}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Recommended Profiles Section */}
                <div className="py-16">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                                Recommended Profiles
                            </h2>
                        </div>
                        <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
                            These profiles are recommended based on the project's target persona and the profiles' similarity to the persona
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recommendedProfiles.slice(0, 8).map((profile: RecommendedProfile) => (
                            <div 
                                key={profile.id} 
                                className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm transition-all duration-500 hover:border-neutral-400/50 hover:shadow-[0_0_30px_rgba(115,115,115,0.2)] hover:scale-105 cursor-pointer"
                            >
                                {/* Profile Image */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img 
                                        src={profile.profilePicture} 
                                        alt={profile.name} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent"></div>
                                    

                                </div>
                                
                                {/* Profile Content */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-neutral-300 transition-colors">
                                            {profile.name}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                                        {profile.description}
                                    </p>
                                    
                                    {/* Strength/Health Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-neutral-500 font-medium">STRENGTH</span>
                                            <span className="text-xs text-green-400 font-bold">
                                                {(profile as any).personaScore || (profile as any).matchScore || 85}%
                                            </span>
                                        </div>
                                        <div className="relative">
                                            {/* Background bar */}
                                            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                {/* Strength fill */}
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-800 to-green-400 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(profile as any).personaScore || (profile as any).matchScore || 85}%` }}
                                                ></div>
                                            </div>
                                            {/* Strength indicators */}
                                            <div className="flex justify-between mt-1">
                                                {[0, 25, 50, 75, 100].map((marker) => (
                                                    <div key={marker} className="flex flex-col items-center">
                                                        <div className="w-px h-1 bg-neutral-700"></div>
                                                        <span className="text-[10px] text-neutral-600 mt-0.5">{marker}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* View All Button */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-4 bg-gradient-to-r from-green-800 to-green-400 hover:from-green-700 hover:to-green-300 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105">
                            View All Profiles
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Final CTA Section - Full Width Footer */}
            <div className="w-full bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 py-20">
                <div className="relative w-full overflow-hidden">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-500/20 via-transparent to-neutral-600/20"></div>
                    </div>
                    
                    {/* CTA Content */}
                    <div className="relative p-8 lg:p-16 text-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                            {/* Success Indicators */}
                            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                                    <span className="text-xs sm:text-sm text-neutral-400">Verified Creators</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                                    <span className="text-xs sm:text-sm text-neutral-400">Quality Assured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                                    <span className="text-xs sm:text-sm text-neutral-400">Fast Turnaround</span>
                                </div>
                            </div> */}
                            
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-100 to-white bg-clip-text text-transparent">
                                Ready to Launch This Campaign?
                            </h2>
                            
                                                            <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                                    Join hundreds of successful brands who have transformed their marketing with our creator network. 
                                    Start your campaign today and see results within days.
                                </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                <button className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-lg transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105">
                                    <Zap className="h-6 w-6" />
                                    {project.cta}
                                </button>
                                <button className="px-8 py-4 border border-neutral-600 hover:border-neutral-400/50 rounded-lg transition-all duration-300 flex items-center gap-3 hover:bg-neutral-400/5">
                                    <Share className="h-5 w-5" />
                                    Share Project
                                </button>
                            </div>
                            
                            {/* Social Proof */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-600 border-2 border-neutral-800"></div>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 border-2 border-neutral-800"></div>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 border-neutral-800"></div>
                                    </div>
                                    <span>500+ brands trust us</span>
                                </div>
                                {/* <div className="hidden sm:block w-px h-4 bg-neutral-700"></div> */}
                                {/* <span>4.9/5 average rating</span> */}
                                <div className="hidden sm:block w-px h-4 bg-neutral-700"></div>
                                <span>24/7 support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
