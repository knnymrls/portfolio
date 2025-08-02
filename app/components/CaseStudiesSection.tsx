'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import CaseStudyCard from './CaseStudyCard'

const caseStudies = [
    {
        title: "FindU",
        description: "Helping GenZ figure out their next steps after graduating high school.",
        readTime: "15 min",
        color: "#e16b6b",
        images: [
            "http://localhost:3845/assets/a9792dee424d8b14c8ab19e719dc092baa735c8b.png",
            "http://localhost:3845/assets/a9792dee424d8b14c8ab19e719dc092baa735c8b.png"
        ],
        defaultSize: 1.2, // Takes up more space by default
        hoveredSize: 1.8
    },
    {
        title: "Nural",
        description: "A innovative chat-based way of learning and analyzing stocks.",
        readTime: "5 min",
        color: "#4ab33c",
        images: [],
        defaultSize: 0.8, // Takes up less space by default
        hoveredSize: 1.2  // Smaller growth than FindU
    },
    {
        title: "Flock",
        description: "Helping teams find time to meet using AI",
        readTime: "5 min",
        color: "#73d8e3",
        images: [],
        defaultSize: 0.8,
        hoveredSize: 1.2  // Smaller growth than FindU
    },
    {
        title: "FindU",
        description: "Helping students find the perfect college through personalization and gamification.",
        readTime: "15 min",
        color: "#ffb4a2",
        images: [],
        defaultSize: 1.2,
        hoveredSize: 1.8
    }
]

export default function CaseStudiesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-['Sora',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#6f6f6f] text-[16px] text-left text-nowrap tracking-[0.32px]"
            >
                CASE STUDIES
            </motion.div>

            <div className="flex flex-col gap-5 w-full">
                {/* First Row */}
                <div 
                    className="grid gap-5 transition-all duration-700 ease-in-out"
                    style={{
                        gridTemplateColumns: hoveredIndex === null || (hoveredIndex !== 0 && hoveredIndex !== 1)
                            ? `${caseStudies[0].defaultSize}fr ${caseStudies[1].defaultSize}fr`
                            : hoveredIndex === 0
                            ? `${caseStudies[0].hoveredSize}fr ${2 - caseStudies[0].hoveredSize}fr`
                            : `${2 - caseStudies[1].hoveredSize}fr ${caseStudies[1].hoveredSize}fr`
                    }}
                >
                    <div className={`relative transition-opacity duration-700 ${
                        hoveredIndex !== null && hoveredIndex !== 0 ? 'opacity-30' : 'opacity-100'
                    }`}>
                        <CaseStudyCard 
                            {...caseStudies[0]} 
                            index={0} 
                            isHovered={hoveredIndex === 0}
                            onHover={() => setHoveredIndex(0)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    </div>

                    <div className={`relative transition-opacity duration-700 ${
                        hoveredIndex !== null && hoveredIndex !== 1 ? 'opacity-30' : 'opacity-100'
                    }`}>
                        <CaseStudyCard 
                            {...caseStudies[1]} 
                            index={1} 
                            isHovered={hoveredIndex === 1}
                            onHover={() => setHoveredIndex(1)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    </div>
                </div>

                {/* Second Row */}
                <div 
                    className="grid gap-5 transition-all duration-700 ease-in-out"
                    style={{
                        gridTemplateColumns: hoveredIndex === null || (hoveredIndex !== 2 && hoveredIndex !== 3)
                            ? `${caseStudies[2].defaultSize}fr ${caseStudies[3].defaultSize}fr`
                            : hoveredIndex === 2
                            ? `${caseStudies[2].hoveredSize}fr ${2 - caseStudies[2].hoveredSize}fr`
                            : `${2 - caseStudies[3].hoveredSize}fr ${caseStudies[3].hoveredSize}fr`
                    }}
                >
                    <div className={`relative transition-opacity duration-700 ${
                        hoveredIndex !== null && hoveredIndex !== 2 ? 'opacity-30' : 'opacity-100'
                    }`}>
                        <CaseStudyCard 
                            {...caseStudies[2]} 
                            index={2} 
                            isHovered={hoveredIndex === 2}
                            onHover={() => setHoveredIndex(2)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    </div>

                    <div className={`relative transition-opacity duration-700 ${
                        hoveredIndex !== null && hoveredIndex !== 3 ? 'opacity-30' : 'opacity-100'
                    }`}>
                        <CaseStudyCard 
                            {...caseStudies[3]} 
                            index={3} 
                            isHovered={hoveredIndex === 3}
                            onHover={() => setHoveredIndex(3)}
                            onLeave={() => setHoveredIndex(null)}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 