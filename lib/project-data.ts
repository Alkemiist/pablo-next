

// This is the page where I pull the project data from the database

export const getProjectData = [
    {
        // Project Context
        id: 1,
        title: "Electrify the City",
        cardDescription: "See your city illuminated by Nissan ARIYA via immersive AR filters and urban light shows",
        fullDescription: "Electrify the City is an immersive AR-driven campaign that reimagines iconic urban landmarks as glowing, Nissan-branded light installations powered by ARIYA. Using an Instagram or mobile AR filter, users can point their devices at buildings, plazas, or bridges and watch them come alive with dynamic animations and overlays infused with Nissan's EV DNA. Influencers and local creators will seed content to spark exploration and social sharing, turning the campaign into a cultural conversation. The experience culminates with a nighttime public event—powered by ARIYA batteries—projecting light sequences onto real landmarks. It's a blending of technology, design, and civic pride that positions Nissan as both innovative and community-minded.",
        businessContext: "Nissan is a leading automaker that is committed to electrifying the future of mobility. They are looking to engage with the urban explorer audience to promote their ARIYA EV and raise awareness about the benefits of electric vehicles.",
        timelineStart: "October 20", 
        timelineEnd: "December 20",

        // Assets
        brand: "Nissan",
        product: "ARIYA",
        persona: "The Urban Explorers are socially connected millennials and Gen Z living in dynamic city environments. They're early adopters, cultural tastemakers, and value discovery, sustainability, and design. Weekends are spent exploring indie cafes, galleries, and live music pop-ups. They love brands that merge creativity with purpose—think Apple for design, Nike for culture, Tesla for tech credibility. They share moments through Instagram Reels and TikTok Stories, gravitating toward immersive experiences over traditional ads. The ARIYA isn't just transportation for them—it's a medium for expression that extends their digitally infused, urban lifestyle.",

        // Objectives & Success
        intent: "Increase brand awareness and engagement with the urban explorer audience",
        primaryKPI: "Awareness",
        smartTarget: "The Urban Explorers are socially connected millennials and Gen Z living in dynamic city environments. They're early adopters, cultural tastemakers, and value discovery, sustainability, and design. Weekends are spent exploring indie cafes, galleries, and live music pop-ups. They love brands that merge creativity with purpose—think Apple for design, Nike for culture, Tesla for tech credibility. They share moments through Instagram Reels and TikTok Stories, gravitating toward immersive experiences over traditional ads. The ARIYA isn't just transportation for them—it's a medium for expression that extends their digitally infused, urban lifestyle.",
        cta: "Interested",

        // Creative Spine
        trend: "Urban landscapes are morphing into interactive, digital-first canvases as brands lean into AR, immersive installations, and pop-up culture to engage younger audiences. These consumers increasingly value shared experiences—moments worthy of a post—over passive brand messaging. At the same time, electric vehicles are gaining traction but often remain abstract symbols of sustainability. By activating AR in real city spaces and tying it to EV storytelling, Nissan humanizes the charge toward electrification—making it visible, poetic, and culturally resonant. This aligns with the experiential marketing trend that blends physical and digital worlds to create emotionally compelling brand connections.",
        videoUrl: "https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "Instagram",
        mainFormat: "Reels",
        constraints: "Must be able to run on Instagram and TikTok",

        // Budget & Guardrails
        budget: 500000,
        mustInclude: ["AR", "Lighting", "Urban", "Design"],
    },
    {
        // Project Context
        id: 2,
        title: "The Stadium Charge",
        cardDescription: "A global pop-up festival showcasing Nissan's EV future with music, tech, and innovation.",
        fullDescription: "Future Roads Festival is Nissan's flagship cultural event, designed to merge technology, sustainability, and entertainment. This traveling pop-up festival takes over city centers and cultural hubs with interactive exhibits, including self-driving car demonstrations, fast-charging hubs, and immersive test drives of the ARIYA and LEAF. At night, stages light up with performances by eco-conscious artists, with stages powered directly by Nissan EV batteries. The festival features panels on innovation, VR experiences, and futuristic design showcases. By framing Nissan as both innovator and cultural patron, the festival captures global attention while making EVs approachable, aspirational, and lifestyle-driven.",
        businessContext: "Nissan is expanding its cultural presence through experiential marketing to showcase EV innovation and sustainability leadership.",
        timelineStart: "October 20",
        timelineEnd: "December 20",

        // Assets
        brand: "Nissan",
        product: "LEAF",
        persona: "The Cultural Seekers are millennial and Gen Z consumers who thrive on unique, shared experiences. They chase music festivals, art installations, and tech expos that merge entertainment with discovery. They love brands that sponsor their culture, like Red Bull for adrenaline, Apple for design, and Adidas for street credibility. They are digitally native, socially vocal, and love capturing moments that signal identity and values online. They embrace eco-conscious lifestyles but expect sustainability to come with style and innovation. Owning or associating with Nissan at such an event elevates their cultural status while affirming their environmental commitments.",

        // Objectives & Success
        intent: "Position Nissan as a cultural innovator and increase brand affinity among festival-goers",
        primaryKPI: "Brand Affinity",
        smartTarget: "The Cultural Seekers are millennial and Gen Z consumers who thrive on unique, shared experiences. They chase music festivals, art installations, and tech expos that merge entertainment with discovery.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Festivals have become platforms for cultural influence and brand integration. As music and tech festivals surge in popularity, they are increasingly intertwined with sustainability conversations and immersive brand activations. Consumers expect brands to contribute to cultural life—not just advertise. Meanwhile, younger audiences want hands-on experiences that bring technology to life. By hosting a festival that's both sustainable and entertaining, Nissan rides the wave of experiential marketing while positioning EVs as aspirational lifestyle products. This taps into the convergence of music, innovation, and sustainability as key cultural drivers, giving Nissan cultural currency far beyond traditional auto advertising.",
        videoUrl: "https://videos.pexels.com/video-files/2249402/2249402-uhd_2560_1440_24fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "Event Marketing",
        mainFormat: "Live Experience",
        constraints: "Must be scalable across multiple cities and integrate with social media",

        // Budget & Guardrails
        budget: 2000000,
        mustInclude: ["Music", "Technology", "Sustainability", "Innovation"],
    },
    {
        // Project Context
        id: 3,
        title: "Future Roads Festival",
        cardDescription: "Visually stunning Instagram content highlighting the KIA Telluride's design and lifestyle integration.",
        fullDescription: "Create a series of visually compelling Instagram posts that showcase the KIA Telluride in real-world scenarios that resonate with our target audience. Each post should feature high-quality photography or videography that captures the vehicle's sleek design, spacious interior, and how it seamlessly integrates into the modern family's lifestyle. We'll focus on storytelling through imagery - showing the Telluride at scenic overlooks, during family adventures, or in everyday moments that highlight its versatility. The captions should be engaging and informative, sharing specific features, benefits, or lifestyle tips that connect with our audience's values. We'll use relevant hashtags, encourage user engagement through questions or calls-to-action, and maintain a consistent aesthetic that aligns with both the KIA brand and the aspirational lifestyle our target demographic seeks.",
        businessContext: "KIA is looking to strengthen its position in the family SUV market by showcasing the Telluride's lifestyle integration and design appeal.",
        timelineStart: "April 20",
        timelineEnd: "May 20",

        // Assets
        brand: "KIA",
        product: "Telluride",
        persona: "The Eco Creators are Gen Z and younger millennials who prioritize climate-conscious choices but also want to share their values through content creation. They are frequent TikTok and Instagram users who enjoy challenges, trending hashtags, and remixable content. They support brands like Patagonia for activism, Glossier for authenticity, and Tesla for innovation. Their lifestyle blends urban minimalism with digital-first identity building. They are community-oriented, valuing challenges that create a sense of belonging. They want brands to show—not tell—what sustainability looks like, rewarding authenticity over corporate messaging.",

        // Objectives & Success
        intent: "Increase brand awareness and showcase Telluride's lifestyle integration through visual storytelling",
        primaryKPI: "Engagement",
        smartTarget: "The Eco Creators are Gen Z and younger millennials who prioritize climate-conscious choices but also want to share their values through content creation.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Visual storytelling through social media has become the primary way brands connect with younger audiences. High-quality lifestyle content that showcases products in real-world scenarios drives higher engagement and brand affinity.",
        videoUrl: "https://videos.pexels.com/video-files/19001188/19001188-uhd_1440_2560_30fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "Instagram",
        mainFormat: "Posts",
        constraints: "Must maintain consistent visual aesthetic and include lifestyle storytelling",

        // Budget & Guardrails
        budget: 1000000,
        mustInclude: ["Lifestyle", "Design", "Family", "Adventure"],
    },
    {
        // Project Context
        id: 4,
        title: "Zero Emissions Challenge",
        cardDescription: "A TikTok eco-challenge encouraging creators to live sustainably with Nissan LEAF.",
        fullDescription: "Zero Emissions Challenge is a creator-driven social campaign where Nissan inspires TikTok and Instagram communities to embrace sustainable living. Participants take on a seven-day challenge, documenting eco-friendly actions such as biking instead of driving, going plastic-free, or using renewable energy at home. The Nissan LEAF is spotlighted as the ultimate zero-emissions lifestyle companion, appearing throughout creator content. Gamified leaderboards track engagement, with Nissan offering prizes such as free charging credits and VIP EV experiences. By fusing social media trends with authentic sustainability storytelling, Nissan transforms climate-conscious behavior into a fun, competitive, and shareable movement.",
        businessContext: "Nissan aims to position the LEAF as the centerpiece of sustainable lifestyle choices while engaging eco-conscious creators and their audiences.",
        timelineStart: "October 20",
        timelineEnd: "December 20",

        // Assets
        brand: "Nissan",
        product: "LEAF",
        persona: "The Eco Creators are Gen Z and younger millennials who prioritize climate-conscious choices but also want to share their values through content creation. They are frequent TikTok and Instagram users who enjoy challenges, trending hashtags, and remixable content. They support brands like Patagonia for activism, Glossier for authenticity, and Tesla for innovation. Their lifestyle blends urban minimalism with digital-first identity building. They are community-oriented, valuing challenges that create a sense of belonging. They want brands to show—not tell—what sustainability looks like, rewarding authenticity over corporate messaging.",

        // Objectives & Success
        intent: "Drive user-generated content and position LEAF as the ultimate sustainable lifestyle companion",
        primaryKPI: "User Generated Content",
        smartTarget: "The Eco Creators are Gen Z and younger millennials who prioritize climate-conscious choices but also want to share their values through content creation.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Social media challenges have become one of the fastest ways to spark cultural movements, particularly on TikTok. At the same time, younger audiences are demanding actionable sustainability from brands, not just messaging. Challenges that combine gamification, accountability, and peer validation are thriving because they turn climate action into culture. Nissan can lead this space by connecting its zero-emissions vehicles to a broader zero-emissions lifestyle, creating cultural relevance while demonstrating the LEAF's role in the transition. This positions Nissan at the intersection of climate responsibility and youth-driven social culture.",
        videoUrl: "https://videos.pexels.com/video-files/6312477/6312477-uhd_2560_1440_25fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "TikTok",
        mainFormat: "Challenge",
        constraints: "Must be gamified and include user-generated content elements",

        // Budget & Guardrails
        budget: 1000000,
        mustInclude: ["Sustainability", "Challenge", "Community", "Gamification"],
    },
    {
        // Project Context
        id: 5,
        title: "Nissan Drift Stories",
        cardDescription: "A docu-series exploring Nissan Z and the underground drift culture worldwide.",
        fullDescription: "Nissan Drift Stories is a cinematic YouTube series celebrating Nissan's motorsport DNA and deep connection to car culture. The series follows legendary drivers and underground communities from Tokyo to Los Angeles, spotlighting the Nissan Z as the hero vehicle. Through interviews, racing footage, and cultural commentary, the series highlights how drifting has evolved from niche sport to global phenomenon, with Nissan at its core. Content is rolled out episodically, each with short-form TikTok/IG reels for virality. The project is both brand heritage storytelling and a recruitment tool for new enthusiasts discovering performance culture for the first time.",
        businessContext: "Nissan wants to celebrate its performance heritage and connect with car culture enthusiasts through authentic storytelling about the Z and drift culture.",
        timelineStart: "October 20",
        timelineEnd: "December 20",

        // Assets
        brand: "Nissan",
        product: "Z",
        persona: "The Trendsetters are urban millennials and Gen Z tastemakers deeply embedded in fashion, art, and culture. They are digitally native, style-conscious, and seek to differentiate themselves through the brands they support. They love Louis Vuitton for luxury innovation, Off-White for street credibility, and Apple for lifestyle integration. They attend or closely follow fashion weeks, museums, and cultural events via Instagram Lives and TikTok coverage. Sustainability matters, but they want it to feel stylish and cultural, not utilitarian. For them, Nissan becomes desirable when it transcends automotive and enters their cultural lexicon as a design and lifestyle symbol.",

        // Objectives & Success
        intent: "Celebrate Nissan's performance heritage and recruit new enthusiasts to the Z brand",
        primaryKPI: "Brand Heritage",
        smartTarget: "The Trendsetters are urban millennials and Gen Z tastemakers deeply embedded in fashion, art, and culture.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Authentic storytelling about subcultures and heritage has become a powerful way for brands to connect with younger audiences. Documentaries and series that explore niche communities create deep emotional connections and cultural relevance.",
        videoUrl: "https://videos.pexels.com/video-files/13718948/13718948-hd_1920_1080_60fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "YouTube",
        mainFormat: "Series",
        constraints: "Must include both long-form and short-form content for cross-platform distribution",

        // Budget & Guardrails
        budget: 600000,
        mustInclude: ["Performance", "Culture", "Heritage", "Storytelling"],
    },  
    {
        // Project Context
        id: 6,
        title: "Charging the Runway",
        cardDescription: "A fashion-meets-tech runway show powered entirely by Nissan ARIYA EV batteries.",
        fullDescription: "Charging the Runway is a fashion-meets-technology activation where Nissan partners with an eco-conscious designer to present a runway show powered entirely by ARIYA EV batteries. Set in a high-profile fashion week venue, the event demonstrates how Nissan electrification powers culture. Models strut alongside ARIYA vehicles styled as design objects, with LED installations creating a futuristic aesthetic. The campaign includes behind-the-scenes social content and an online capsule collection drop. This project elevates Nissan beyond the auto industry, aligning the brand with progressive design and proving that EV technology can fuel creativity as much as mobility.",
        businessContext: "Nissan aims to elevate its brand beyond automotive by aligning with progressive design and fashion culture, showcasing EV technology as both functional and artistic.",
        timelineStart: "April 20",
        timelineEnd: "May 20",

        // Assets
        brand: "Nissan",
        product: "ARIYA",
        persona: "The Fashion-Forward Innovators are millennials and Gen Z who are passionate about technology, sustainability, and design. They are frequent Instagram and TikTok users who enjoy fashion, art, and technology. They support brands like Apple for design, Nike for culture, and Tesla for innovation. Their lifestyle blends urban minimalism with digital-first identity building. They are community-oriented, valuing challenges that create a sense of belonging. They want brands to show—not tell—what sustainability looks like, rewarding authenticity over corporate messaging.",

        // Objectives & Success
        intent: "Position Nissan as a cultural innovator in fashion and design while showcasing ARIYA's technological capabilities",
        primaryKPI: "Cultural Relevance",
        smartTarget: "The Fashion-Forward Innovators are millennials and Gen Z who are passionate about technology, sustainability, and design.",
        cta: "Apply Now",

        // Creative Spine
        trend: "The fusion of fashion, culture, and sustainability is exploding, with brands using runway shows and collaborations to demonstrate innovation beyond their core category. Fashion weeks have become content spectacles as much as industry events, with younger audiences consuming them on TikTok and Instagram. Simultaneously, sustainability has become a must-have narrative, particularly in fashion, where energy and material use are under scrutiny. Nissan can insert itself into this cultural crossroads by showing its EV technology as both functional and artistic. By powering a fashion show, Nissan captures attention from design-conscious audiences while reinforcing its leadership in electrification.",
        videoUrl: "https://videos.pexels.com/video-files/9861744/9861744-uhd_2732_1440_25fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "Event Marketing",
        mainFormat: "Runway Show",
        constraints: "Must integrate with fashion week and include social media content creation",

        // Budget & Guardrails
        budget: 1000000,
        mustInclude: ["Fashion", "Technology", "Sustainability", "Design"],
    },
    {
        // Project Context
        id: 7,
        title: "TikTok Series",
        cardDescription: "Multi-part TikTok series showcasing different KIA Telluride features through creative, engaging short-form content.",
        fullDescription: "Develop a comprehensive TikTok series that explores various aspects of the KIA Telluride through creative, engaging short-form content designed specifically for the platform's audience. Each video in the series should focus on a different feature or benefit of the vehicle, from its spacious interior and advanced safety technology to its smooth handling and fuel efficiency. We'll leverage TikTok's creative tools and trends to make each video engaging and shareable, using popular sounds, effects, and challenge formats that resonate with our target demographic. The series should tell a cohesive story about the Telluride while maintaining the platform's authentic, fun, and sometimes humorous tone. We'll include user-generated content opportunities, interactive elements that encourage engagement, and behind-the-scenes glimpses that give viewers a sense of connection to the brand. Each video should be optimized for the platform's algorithm while providing valuable information about the vehicle.",
        businessContext: "KIA aims to engage younger audiences through TikTok while showcasing the Telluride's features and family-friendly capabilities.",
        timelineStart: "April 20",
        timelineEnd: "May 20",

        // Assets
        brand: "KIA",
        product: "Telluride",
        persona: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs. They enjoy weekend road trips with loved ones, often discovering national parks and picturesque routes. Tech-savvy, they appreciate gadgets that enhance their adventures, such as smart home devices and fitness trackers. A spacious and stylish SUV is their vehicle of choice, valued for safety and comfort. They favor brands like Patagonia for outdoor gear and Apple for tech products, reflecting their active lifestyle and family values.",

        // Objectives & Success
        intent: "Increase brand awareness and showcase Telluride features through engaging TikTok content",
        primaryKPI: "Engagement",
        smartTarget: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Short-form video content has become the primary way to engage younger audiences, with TikTok leading the way in creative, authentic storytelling that feels native to the platform.",
        videoUrl: "https://videos.pexels.com/video-files/3111402/3111402-uhd_2560_1440_25fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "TikTok",
        mainFormat: "Series",
        constraints: "Must be optimized for TikTok algorithm and include interactive elements",

        // Budget & Guardrails
        budget: 10000,
        mustInclude: ["Family", "Adventure", "Features", "Engagement"],
    },
    {
        // Project Context
        id: 8,
        title: "Instagram Series",
        cardDescription: "Multi-part Instagram series highlighting the KIA Telluride's lifestyle integration through curated visual storytelling.",
        fullDescription: "Create a sophisticated Instagram series that showcases the KIA Telluride's integration into various lifestyle scenarios through carefully curated visual storytelling. Each post in the series should focus on a different aspect of the vehicle's relationship with modern family life, from daily commutes and school runs to weekend adventures and special occasions. We'll use high-quality photography and videography that captures the Telluride in real-world settings, emphasizing its design aesthetic and how it complements different environments and situations. The series should maintain a consistent visual theme while varying the content to keep followers engaged and interested. We'll incorporate user-generated content, behind-the-scenes glimpses, and interactive elements that encourage community engagement. Each post should tell a story that resonates with our target audience, highlighting the emotional and practical benefits of choosing the Telluride for their family's transportation needs.",
        businessContext: "KIA wants to strengthen its position in the family SUV market by showcasing the Telluride's lifestyle integration through premium visual content.",
        timelineStart: "April 20, 2025",
        timelineEnd: "May 20, 2025",

        // Assets
        brand: "KIA",
        product: "Telluride",
        persona: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs. They enjoy weekend road trips with loved ones, often discovering national parks and picturesque routes. Tech-savvy, they appreciate gadgets that enhance their adventures, such as smart home devices and fitness trackers. A spacious and stylish SUV is their vehicle of choice, valued for safety and comfort. They favor brands like Patagonia for outdoor gear and Apple for tech products, reflecting their active lifestyle and family values.",

        // Objectives & Success
        intent: "Showcase Telluride's lifestyle integration and build brand affinity through premium visual storytelling",
        primaryKPI: "Brand Affinity",
        smartTarget: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Premium visual storytelling on Instagram has become essential for lifestyle brands, with high-quality photography and videography driving engagement and brand perception among aspirational audiences.",
        videoUrl: "https://videos.pexels.com/video-files/3111402/3111402-uhd_2560_1440_25fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "Instagram",
        mainFormat: "Posts",
        constraints: "Must maintain consistent visual aesthetic and include lifestyle storytelling",

        // Budget & Guardrails
        budget: 10000,
        mustInclude: ["Lifestyle", "Family", "Adventure", "Visual Storytelling"],
    },
    {
        // Project Context
        id: 9,
        title: "TikTok Series",
        cardDescription: "Engaging TikTok series featuring KIA Telluride lifestyle content, challenges, and behind-the-scenes family adventures.",
        fullDescription: "Develop an engaging TikTok series that brings the KIA Telluride to life through creative lifestyle content, interactive challenges, and authentic behind-the-scenes family adventures. Each video should showcase different aspects of the vehicle while maintaining the platform's energetic and authentic vibe. We'll create content that ranges from practical demonstrations of the Telluride's features to fun family challenges that highlight the vehicle's spacious interior and versatility. The series should include user-generated content opportunities, interactive polls and questions, and behind-the-scenes glimpses that give viewers a sense of connection to both the brand and the families featured. We'll leverage trending sounds, effects, and challenge formats while ensuring each video provides value and information about the vehicle. The content should feel natural and unscripted, capturing real moments that families can relate to and aspire to experience with their own Telluride.",
        businessContext: "KIA aims to create authentic, engaging content that showcases the Telluride's family-friendly features through TikTok's dynamic platform.",
        timelineStart: "April 20",
        timelineEnd: "May 20",

        // Assets
        brand: "KIA",
        product: "Telluride",
        persona: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs. They enjoy weekend road trips with loved ones, often discovering national parks and picturesque routes. Tech-savvy, they appreciate gadgets that enhance their adventures, such as smart home devices and fitness trackers. A spacious and stylish SUV is their vehicle of choice, valued for safety and comfort. They favor brands like Patagonia for outdoor gear and Apple for tech products, reflecting their active lifestyle and family values.",

        // Objectives & Success
        intent: "Create authentic family content that showcases Telluride's versatility and builds emotional connection with target audience",
        primaryKPI: "Engagement",
        smartTarget: "Meet the modern outdoor enthusiast, a family-oriented individual in their mid-thirties living in the suburbs.",
        cta: "Apply Now",

        // Creative Spine
        trend: "Authentic, behind-the-scenes family content performs exceptionally well on TikTok, with viewers craving real moments and relatable experiences over polished advertising.",
        videoUrl: "https://videos.pexels.com/video-files/3111402/3111402-uhd_2560_1440_25fps.mp4",
        creativeReferences: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],

        // Channels & Formats
        mainChannel: "TikTok",
        mainFormat: "Series",
        constraints: "Must feel authentic and unscripted while showcasing vehicle features naturally",

        // Budget & Guardrails
        budget: 10000,
        mustInclude: ["Family", "Authenticity", "Challenges", "Behind-the-Scenes"],
    }
]

export const recommendedProfiles = [
    {
        id: 1,
        name: "Sarah Chen",
        profilePicture: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Strategic brand consultant specializing in Asian markets and cross-cultural storytelling.",
        personaScore: 90,
    },
    {
        id: 2,
        name: "Marcus Rodriguez",
        profilePicture: "https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bilingual marketing strategist with deep roots in Hispanic culture and community engagement.",
        personaScore: 80,
    },
    {
        id: 3,
        name: "Aisha Patel",
        profilePicture: "https://images.pexels.com/photos/3778681/pexels-photo-3778681.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Digital innovation specialist focused on sustainable tech and South Asian market insights.",
        personaScore: 70,
    },
    {
        id: 4,
        name: "James Thompson",
        profilePicture: "https://images.pexels.com/photos/3778682/pexels-photo-3778682.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Seasoned creative director with expertise in automotive and lifestyle brand transformation.",
        personaScore: 60,
    },
    {
        id: 5,
        name: "Emma Wilson",
        profilePicture: "https://images.pexels.com/photos/3778683/pexels-photo-3778683.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Social media strategist specializing in Gen Z engagement and viral content creation.",
        personaScore: 50,
    },
    {
        id: 6,
        name: "David Kim",
        profilePicture: "https://images.pexels.com/photos/3778684/pexels-photo-3778684.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Tech-forward marketing consultant bridging Korean innovation with global strategy.",
        personaScore: 40,
    },
    {
        id: 7,
        name: "Sophia Garcia",
        profilePicture: "https://images.pexels.com/photos/3778685/pexels-photo-3778685.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Multicultural brand strategist specializing in fashion and culturally resonant campaigns.",
        personaScore: 30,
    },
    {
        id: 8,
        name: "Alex Johnson",
        profilePicture: "https://images.pexels.com/photos/3778686/pexels-photo-3778686.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Data-driven marketing analyst transforming insights into compelling brand narratives.",
        personaScore: 20,
    },
    
    {
        id: 9,
        name: "Maya Singh",
        profilePicture: "https://images.pexels.com/photos/3778687/pexels-photo-3778687.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Sustainability-focused creative director with South Asian perspective on eco-branding.",
        personaScore: 10,
    },
    {
        id: 10,
        name: "Ryan O'Connor",
        profilePicture: "https://images.pexels.com/photos/3778688/pexels-photo-3778688.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Sports marketing specialist creating campaigns that unite fans through shared passion.",
        matchScore: 90
    },
    {
        id: 11,
        name: "Zoe Williams",
        profilePicture: "https://images.pexels.com/photos/3778689/pexels-photo-3778689.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Trend forecasting expert specializing in youth culture and emerging lifestyle movements.",
        matchScore: 90
    },
    {
        id: 12,
        name: "Maria Garcia",
        profilePicture: "https://images.pexels.com/photos/3778690/pexels-photo-3778690.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Bilingual content strategist creating authentic connections with Hispanic communities.",
        matchScore: 90
    }
]