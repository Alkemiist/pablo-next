'use client';

// imports
import { useState } from 'react';
import Link from 'next/link';
import { useBriefData } from '@/app/context/briefcontext';

// objects
const intentChoices = [
    {   name: 'Brand Awareness',
        description: 'Introduce your brand or product to a larger audience to genereate visibility and recognition.',
        id: 1
    },
    {
        name: 'Lead Generation',
        description: 'Capture potential customer information to nurture and convert them into leads.',
        id: 2
    },
    {
        name: 'Product Launch',
        description: 'Promote a new product or service to create excitement and drive initial sales.',
        id: 3
    },
    {
        name: 'Engagement / Community Building',
        description: 'Build stronger relationships with your audience through interaction, shares and commments.',
        id: 4
    },
    {
        name: 'Education / Thought Leadership',
        description: 'Position your brand as an expert by offering valuable insights and useful content.',
        id: 5
    },
    {
        name: 'Customer Retention',
        description: 'Keep existing customers engaged to drive repeat business and loyalty.',
        id: 6
    },
    {
        name: 'Event Promotion',
        description: 'Drive attendance and awareness for an upcoming event or activity.',
        id: 7
    },
    {
        name: 'Sales Conversions',
        description: 'Directly drive actions like purchases, sign-ups or other conversions.',
        id: 8
    },
    {
        name: 'Reputation Management',
        description: 'Maintain or improve your brand image, managing PR or customer feedback.',
        id: 9
    },
    {
        name: 'Social Proof / Testimonials',
        description: 'Build credibility by showcasing customer reviews, testimonials, or influencer endorsements.',
        id: 10
    },
    {
        name: 'Seasonal / Holiday Promotions',
        description: 'Promote time-sensitive offers or events to capitalize on seasonal trends.',
        id: 11
    },
    {
        name: 'Market Research',
        description: 'Gather insights and feedback from your audience to improve products or services.',
        id: 12
    },
    {
        name: 'Brand Advocacy',
        description: 'Turn customers into advocates who will promote your brand to others.',
        id: 13
    },
    {
        name: 'Product Education',
        description: 'Help users understand how to use a product or service with guides and tutorials.',
        id: 14
    },
    {
        name: 'Corporate Social Responsibility',
        description: 'Showcase your brand\'s social or environmental contributions to promote a positive image.',
        id: 15
    },
    {
        name: 'Partnership Collaboration',
        description: 'Announce or build partnerships with other brands, influencers, or organizations.',
        id: 16
    },
    {
        name: 'Fundraising / Charity',
        description: 'Drive donations or raise funds for a cause or organization.',
        id: 17
    },
    {
        name: 'Influencer Marketing',
        description: 'Work with to expand your reach and promote your products.',
        id: 18
    },
    {
        name: 'Customer Feedback',
        description: 'Gather feedback through surveys or reviews to improve your products or services.',
        id: 19
    },
    {
        name: 'Launch an Offer',
        description: 'Promote a new offer or discount to drive sales and conversions.',
        id: 20
    },
];


export default function IntentPage() {

    const { intent, setIntent } = useBriefData();
    // this is the state for the selected card
    const [ selectedCard, setSelectedCard ] = useState<number>( 0 );
    


    return (

        // This is the main container for the page
        <div className="p-12 flex flex-col gap-24 justify-center items-center h-screen">
            
            {/* This is the title and description for the page */}
            <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="text-2xl font-bold">What is the intent?</h1>
                <p className="flex flex-col gap-2 flex-wrap w-150 text-sm text-center text-slate-500">
                    The intent defines the goal of your content, ensuring that it aligns with your overall marketing objectives. 
                    It helps guide the strategy and focus of the campaign.
                </p>
            </div>

            {/* This is the choice component grid */}
            <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
                { intentChoices.map( choice => {
                    return (
                        <div 
                        className={`flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700`}
                        key={ choice.id }
                        onClick={ () => {
                            console.log( choice.name, choice.description );
                        } }
                        >
                            <h2 className="text-lg font-bold">{ choice.name }</h2>
                            <p className=" text-slate-500">{ choice.description }</p>
                        </div>
                    )
                } ) }
            </div>

        </div>
    )
}