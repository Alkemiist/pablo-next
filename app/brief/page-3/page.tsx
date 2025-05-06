'use client';

// imports


// card objects for each section
const textOnly = [

    {
        name: 'Email Marketing',
        description: 'Crafting email content for newsletters, promotions, or updates.',
        id: '1'
    },
    {
        name: 'Blog Posts',
        description: 'Writing long-form, SEO-optimized articles or blog posts to attract organic traffic.',
        id: '2'
    },
    {
        name: 'Ad Copy',
        description: 'Writing text for display ads, paid search ads, or social media ads.',
        id: '3'
    },
    {
        name: 'Website Copy',
        description: 'Creating the text for landing pages, product pages, or any part of a website..',
        id: '4'
    },
    {
        name: 'Social Post Copy',
        description: 'Writing captions or posts for platforms like Facebook, Twitter, LinkedIn, or Instagram..',
        id: '5'
    },
    {
        name: 'Product Descriptions',
        description: 'Writing detailed descriptions for products or services to help customers make informed decisions.',
        id: '6'
    },
    {
        name: 'White Papers / E-Books',
        description: 'Creating in-depth, informative content to showcase industry authority and generate leads.',
        id: '7'
    },
    {
        name: 'Press Releases',
        description: 'Crafting press releases for announcements, product launches, or company news.',
        id: '8'
    },

]



export default function tacticsPage() {

    return (

        // this is the main container for the page
        <div className="flex flex-col gap-4 overflow-y-auto">

                {/* This is the header component */}            
                <div className="flex flex-col gap-4 justify-center items-center mt-12">
                    <h1 className="text-2xl font-bold">What type of content are you looking for?</h1>
                    <p className="flex flex-col gap-2 flex-wrap w-150 text-sm text-center text-slate-500">
                        The intent defines the goal of your content, ensuring that it aligns with your overall marketing objectives. It helps guide the strategy and focus of the campaign.
                    </p>
                </div>
            
        {/* This parent div to the multi sections */}
        <div className="flex flex-col">

            {/* This is the text-only div */}
            <div className="p-8 flex flex-col gap-8 justify-center items-center">
                
                    <h1 className="text-xl font-bold">Text-Only Content</h1>
                    <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
                    { textOnly.map( choice => {
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

            {/* This is the image-only div */}
            <div className="flex flex-col gap-8 justify-center items-center p-8">
                    <h1 className="text-xl font-bold">Image-Only Content</h1>
                    <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
                    { textOnly.map( choice => {
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

                {/* This is the hybrid div */}
            <div className="p-8 flex flex-col gap-8 justify-center items-center">
                
                <h1 className="text-xl font-bold">Hybrid Content</h1>
                <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
                { textOnly.map( choice => {
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

            

            


            
        </div>
            

        </div>
    )
}   
