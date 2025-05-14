'use client';

//imports
import { useBriefData } from '@/app/context/briefcontext';
import { useState } from 'react';

const messageArray = [
    {
        name: 'Product Innovation',
        description: 'Highlight how your product is cutting-edge and changes the way people approach a particular problem.',
        id: '1'
    },
    {
        name: 'Brand Values / Mission',
        description: 'Showcase the core values or mission behind your brand, such as sustainability, customer-first approach, or innovation.',
        id: '2'
    },  
    {
        name: 'Customer Experience',
        description: 'Share real customer experiences or testimonials that highlight your product’s impact.',
        id: '3'
    },  
    {
        name: 'Product Benefits',
        description: 'Focus on the tangible benefits of your product, how it solves specific problems, or improves users’ lives.',
        id: '4'
    },  
    {
        name: 'Exclusive Offer / Deal',
        description: 'Promote a limited-time offer, discount, or promotion to encourage immediate action.',
        id: '5'
    },
    {
        name: 'Brand Story',
        description: 'Tell the story of how your brand was created, your journey, and what drives you.',
        id: '6'
    },  
    {
        name: 'Product Features',
        description: 'Highlight key features of the product, demonstrating its uniqueness and functionality.',
        id: '7'
    },  
    {
        name: 'Customer Success',
        description: 'Present a case study or a success story where your product made a measurable impact, providing proof of its value.',
        id: '8'
    },  
]

const objectiveArray = [
    {
        name: 'Increase Engagement',
        description: 'Focus on driving interactions with your audience through likes, shares, comments, and other forms of engagement.',
        id: '1' 
    },
    {
        name: 'Drive Traffic',
        description: 'Aim to drive more traffic to your website, landing page, or a specific product page.',
        id: '2'
    },  
    {
        name: 'Encourage Purchases',
        description: 'The goal is to generate sales or conversions by persuading the audience to buy your product.',
        id: '3'
    },  
    {
        name: 'Build Brand Loyalty',
        description: 'Foster long-term relationships with your audience by strengthening their attachment to your brand.',
        id: '4'
    },  
    {
        name: 'Raise Awareness',
        description: 'Increase visibility for your brand or product and ensure more people become aware of what you offer.',
        id: '5'
    },
    {
        name: 'Collect Leads',
        description: 'Generate new leads by capturing contact information from potential customers who are interested in your products or services.',
        id: '6'
    },  
    {
        name: 'Strengthen Brand Perception',
        description: 'Shape or reinforce how people see your brand—luxury, trust, innovation, and more.',
        id: '7'
    },  
    {
        name: 'Generate Excitement',
        description: 'Build buzz and excitement that gets people talking and sharing your brand.',
        id: '8'
    },  
]


export default function messageAndObjectivePage() {

    // destructuring the message and objective from the brief context hook
    const { message, setMessage } = useBriefData();
    const { objective, setObjective } = useBriefData();
    const [ messageCardSelected, setMessageCardSelected ] = useState( null );
    const [ objectiveCardSelected, setObjectiveCardSelected ] = useState( null );

    console.log( messageCardSelected );
    console.log( objectiveCardSelected );

    return (

        // this is the parent container for the page
        <div className="flex flex-col gap-4 overflow-y-auto pt-8 pb-20">

            {/* this is the message section ------------------------------------------------------------ */}
            <div className='flex flex-col gap-12 justify-center items-center p-8'>

                {/* this is the header --------------------------------*/}
                <div className="container flex flex-col gap-4 justify-center items-center max-w-200 min-w-100 text-center">
                    <h1 className="text-2xl font-bold">
                        What is the key message you want to convey?
                    </h1>
                    <p className="flex flex-col gap-2 flex-wrap w-auto text-sm text-center text-slate-500 cursor-pointer">
                        The key message is the core idea you want your audience to take away. A clear message 
                        keeps your content focused and ensures it communicates the right ideas effectively.
                    </p>
                </div>

                {/* this is the cards section -------------------------- */}
                <div className='flex flex-wrap gap-4 justify-center items-center'>
                    { messageArray.map( choice => {
                        return (
                            <div 
                            className='flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700 cursor-pointer'
                            key={ choice.id }
                            onClick={ () => {
                                {/* space for the function to set the message card selected */}
                            } }
                            >
                                <h2 className='text-lg font-bold'>{ choice.name }</h2>
                                <p className='text-slate-500'>{ choice.description }</p>
                            </div>
                        )
                    } ) }
                </div>

            </div>     


            {/* this is the objective section ------------------------------------------------------------ */}
            <div className='flex flex-col gap-12 justify-center items-center p-8'>

                {/* this is the header --------------------------------*/}
                <div className="container flex flex-col gap-4 justify-center items-center max-w-200 min-w-100 text-center">
                    <h1 className="text-2xl font-bold">
                        What is the primary objective?
                    </h1>
                    <p className="flex flex-col gap-2 flex-wrap w-150 text-sm text-center text-slate-500 cursor-pointer">
                        The objective defines the result you want to achieve, guiding the content’s purpose and strategy. Without 
                        a clear objective, the content may lack focus and fail to deliver meaningful outcomes.
                    </p>
                </div>

                {/* this is the cards section -------------------------- */}
                <div className='flex flex-wrap gap-4 justify-center items-center'>
                    { objectiveArray.map( choice => {
                        return (
                            <div 
                            className='flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700 cursor-pointer'
                            key={ choice.id }
                            onClick={ () => {
                                console.log( choice.name, choice.description );
                            } }
                            >
                                <h2 className='text-lg font-bold'>{ choice.name }</h2>
                                <p className='text-slate-500'>{ choice.description }</p>
                            </div>
                        )
                    } ) }
                </div>

            </div>   

        </div>

    )
}