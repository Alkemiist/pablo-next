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

const imageOnly = [
    {
        name: 'Social Media Post Image',
        description: 'Creating static image posts for social platforms like Instagram, Facebook, or LinkedIn.',
        id: '1'
    },
    {
        name: 'Infographics',
        description: 'Designing visually engaging infographics that simplify complex information into digestible visuals.',
        id: '2'
    },
    {
        name: 'Product Photography',
        description: 'Creating product images for e-commerce sites, ads, or promotions.',
        id: '3'
    },
    {
        name: 'Email Headers & Graphics',
        description: 'Designing visually engaging headers and graphics for email campaigns.',
        id: '4'
    },
    {
        name: 'Posters & Flyers',
        description: 'Designing printable or digital promotional materials like posters, flyers, or event graphics.',
        id: '5'
    },
    {
        name: 'Billboards & Outdoor Ads',
        description: 'Creating a new or refined logo for branding purposes.',
        id: '6'
    },
    {
        name: 'Website Heros & Banners',
        description: 'Hero images or banners for websites to capture attention and enhance user experience.',
        id: '7'
    },
    {
        name: 'Social Media Graphics',
        description: 'Creating branded visuals for use in social media content.',
        id: '8'
    },
]

const hybrid = [
    {
        name: 'Full Social Media Post',
        description: 'A combination of an engaging image or graphic paired with a caption or text to increase engagement.',
        id: '1'
    },
    {
        name: 'Email Campaign',
        description: 'Crafting email newsletters or promotions that combine engaging visuals with compelling text to encourage action.',
        id: '2'
    },
    {
        name: 'Ad Campaign',
        description: 'Running multi-format ad campaigns that combine images, text, and video to maximize reach and engagement across platforms.',
        id: '3'
    },
    {
        name: 'Infographic + Blog Post',
        description: 'Using an infographic within a blog post to both inform and visually engage the reader.',
        id: '4'
    },
]



export default function tacticsPage() {
  return (
    // this is the main container for the page
    <div className="flex flex-col items-center gap-4 overflow-y-auto">
      {/* This is the header component */}
      <div className="flex flex-col gap-4 justify-center items-center mt-12">
        <h1 className="text-2xl font-bold">
          What type of content are you looking for?
        </h1>
        <p className="flex flex-col gap-2 flex-wrap w-150 text-sm text-center text-slate-500">
          The intent defines the goal of your content, ensuring that it aligns
          with your overall marketing objectives. It helps guide the strategy
          and focus of the campaign.
        </p>
      </div>

      {/* This parent div to the multi sections */}
      <div className="flex flex-col">

        {/* This is the text-only div */}
        <div className=" p-8 flex flex-col gap-8 justify-center items-center">
          <h1 className="text-xl font-bold">Text-Only Content</h1>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {textOnly.map((choice) => {
              return (
                <div
                  className={`flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700`}
                  key={choice.id}
                  onClick={() => {
                    console.log(choice.name, choice.description);
                  }}
                >
                  <h2 className="text-lg font-bold">{choice.name}</h2>
                  <p className=" text-slate-500">{choice.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* This is the image-only div */}
        <div className="flex flex-col gap-8 justify-center items-center p-8">
          <h1 className="text-xl font-bold">Image-Only Content</h1>
          <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
            {imageOnly.map((choice) => {
              return (
                <div
                  className={`flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700`}
                  key={choice.id}
                  onClick={() => {
                    console.log(choice.name, choice.description);
                  }}
                >
                  <h2 className="text-lg font-bold">{choice.name}</h2>
                  <p className=" text-slate-500">{choice.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* This is the hybrid div */}
        <div className="p-8 flex flex-col gap-8 justify-center items-center">
          <h1 className="text-xl font-bold">Hybrid Content</h1>
          <div className="flex flex-wrap gap-4 justify-center items-center overflow-y-auto">
            {hybrid.map((choice) => {
              return (
                <div
                  className={`flex flex-col gap-2 w-100 h-36 bg-slate-900 rounded-lg shadow-md p-6 hover:bg-slate-800 transition-colors duration-300 border border-slate-700`}
                  key={choice.id}
                  onClick={() => {
                    console.log(choice.name, choice.description);
                  }}
                >
                  <h2 className="text-lg font-bold">{choice.name}</h2>
                  <p className=" text-slate-500">{choice.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}   
