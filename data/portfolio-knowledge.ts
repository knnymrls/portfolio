export const portfolioKnowledge = {
  personal: {
    name: "Kenny Morales",
    username: "knnymrls",
    role: "Designer & Developer",
    focus: "AI Interfaces",
    status: "Co-founder of two startups, creating tech/startup content",
    location: "Remote",
    bio: "Passionate about building AI-powered interfaces that make technology more accessible and intuitive. Currently focused on scaling startup ventures while mentoring the next generation of creators.",
  },

  projects: [
    {
      name: "FindU",
      type: "startup",
      status: "active",
      valuation: "2.5M",
      description: "A location-based social platform that helps people discover and connect with others in their area",
      role: "Co-founder & Technical Lead",
      technologies: ["React Native", "Node.js", "PostgreSQL", "AWS", "WebRTC"],
      achievements: [
        "Raised $2.5M in seed funding",
        "10K+ active users in beta",
        "Featured in TechCrunch startup spotlight"
      ],
      highlights: ["Social Platform", "Location-based", "Real-time matching"],
      year: "2023-present"
    },
    {
      name: "Mkrs",
      type: "agency", 
      status: "active",
      description: "Software consulting agency specializing in AI-powered web applications and custom development solutions",
      role: "Founder & Lead Developer",
      technologies: ["Next.js", "TypeScript", "Python", "OpenAI API", "Vercel"],
      achievements: [
        "20+ successful client projects",
        "Specialized in AI integration",
        "100% client satisfaction rate"
      ],
      highlights: ["Consulting", "AI Integration", "Custom Development"],
      year: "2022-present"
    },
    {
      name: "Creators",
      type: "community",
      status: "active", 
      description: "A coding club and community platform for aspiring developers to learn, collaborate, and build projects together",
      role: "Founder & Mentor",
      technologies: ["Discord API", "GitHub", "React", "Community Management"],
      achievements: [
        "500+ active members",
        "Monthly coding challenges",
        "Mentorship program for beginners"
      ],
      highlights: ["Education", "Community", "Mentorship"],
      year: "2021-present"
    }
  ],

  skills: {
    technical: {
      languages: [
        "TypeScript/JavaScript",
        "Python", 
        "HTML/CSS",
        "SQL",
        "Swift"
      ],
      frameworks: [
        "React/Next.js",
        "React Native", 
        "Node.js",
        "Express",
        "FastAPI",
        "TailwindCSS"
      ],
      aiMl: [
        "OpenAI API",
        "LangChain",
        "Vector Databases",
        "Prompt Engineering",
        "RAG Systems",
        "AI Agent Development"
      ],
      databases: [
        "PostgreSQL",
        "MongoDB", 
        "Supabase",
        "Redis",
        "Pinecone"
      ],
      cloud: [
        "AWS",
        "Vercel",
        "Railway", 
        "Docker",
        "GitHub Actions"
      ],
      design: [
        "Figma",
        "Adobe Creative Suite",
        "UI/UX Design",
        "Design Systems",
        "Prototyping"
      ]
    },
    soft: [
      "Product Strategy",
      "Team Leadership", 
      "Startup Operations",
      "Client Communication",
      "Mentoring",
      "Public Speaking"
    ]
  },

  ventures: {
    current: [
      {
        name: "FindU",
        role: "Co-founder & CTO",
        stage: "Seed Stage",
        funding: "$2.5M raised",
        description: "Building the future of location-based social discovery",
        focus: "Product development and technical scaling"
      },
      {
        name: "Mkrs",
        role: "Founder",
        stage: "Bootstrapped",
        revenue: "Growing MRR",
        description: "Helping businesses integrate AI into their workflows",
        focus: "Client delivery and team expansion"
      }
    ],
    investment: "Open to angel investments in AI and social tech startups",
    advisory: "Available for technical advisory roles in early-stage startups"
  },

  experience: {
    entrepreneurship: [
      "2+ years building and scaling startups",
      "Experience with fundraising and investor relations", 
      "Product-market fit validation",
      "Team building and leadership"
    ],
    development: [
      "5+ years of full-stack development",
      "Specialized in AI/ML integration",
      "Built products serving 10K+ users",
      "Expertise in modern web technologies"
    ],
    community: [
      "Active in startup and tech communities",
      "Regular speaker at tech meetups",
      "Mentor for coding bootcamp graduates",
      "Contributor to open-source projects"
    ]
  },

  contact: {
    availability: "Open to discussing new opportunities, partnerships, and collaborations",
    interests: [
      "AI/ML projects",
      "Startup collaborations", 
      "Technical advisory roles",
      "Speaking opportunities",
      "Investment opportunities"
    ],
    response_time: "Usually responds within 24 hours",
    preferred_contact: "Contact form or LinkedIn for professional inquiries"
  },

  social: {
    github: "Active developer with open-source contributions",
    linkedin: "Professional network and industry updates", 
    instagram: "Behind-the-scenes content and startup journey",
    twitter: "Tech thoughts and startup insights"
  },

  content: {
    focuses: [
      "AI development tutorials",
      "Startup building insights", 
      "Technical deep-dives",
      "Career guidance for developers"
    ],
    platforms: ["Blog", "YouTube", "Twitter", "LinkedIn"],
    audience: "Developers, entrepreneurs, and AI enthusiasts"
  }
};

export type PortfolioKnowledge = typeof portfolioKnowledge;