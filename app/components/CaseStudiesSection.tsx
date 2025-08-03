'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import CaseStudyCard from './CaseStudyCard'
import { projects } from '../utils/projectData'
import { ANIMATION_DURATIONS } from '../constants'

// Filter only case studies from projects data
const caseStudies = projects.filter(project => project.category === 'case-study')

interface CaseStudiesSectionProps {
    highlightedProjectId?: string | null
}

export default function CaseStudiesSection({ highlightedProjectId }: CaseStudiesSectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    useEffect(() => {
        if (highlightedProjectId) {
            const index = caseStudies.findIndex(study => study.id === highlightedProjectId)
            if (index !== -1) {
                setHoveredIndex(index)
            }
        } else {
            setHoveredIndex(null)
        }
    }, [highlightedProjectId])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="section-header font-['Sora',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#6f6f6f] text-[16px] text-left text-nowrap tracking-[0.32px]"
            >
                CASE STUDIES
            </motion.div>

            <div className="flex flex-col gap-5 w-full">
                {/* First Row */}
                {caseStudies.length >= 2 && (
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
                        <div className={`relative transition-opacity duration-700 ${hoveredIndex !== null && hoveredIndex !== 0 ? 'opacity-30' : 'opacity-100'
                            }`}>
                            <CaseStudyCard
                                {...caseStudies[0]}
                                index={0}
                                isHovered={hoveredIndex === 0}
                                onHover={() => setHoveredIndex(0)}
                                onLeave={() => setHoveredIndex(null)}
                            />
                        </div>

                        <div className={`relative transition-opacity duration-700 ${hoveredIndex !== null && hoveredIndex !== 1 ? 'opacity-30' : 'opacity-100'
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
                )}

                {/* Second Row */}
                {caseStudies.length >= 4 && caseStudies[2] && caseStudies[3] && (
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
                        <div className={`relative transition-opacity duration-700 ${hoveredIndex !== null && hoveredIndex !== 2 ? 'opacity-30' : 'opacity-100'
                            }`}>
                            <CaseStudyCard
                                {...caseStudies[2]}
                                index={2}
                                isHovered={hoveredIndex === 2}
                                onHover={() => setHoveredIndex(2)}
                                onLeave={() => setHoveredIndex(null)}
                            />
                        </div>

                        <div className={`relative transition-opacity duration-700 ${hoveredIndex !== null && hoveredIndex !== 3 ? 'opacity-30' : 'opacity-100'
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
                )}

                {/* Handle remaining case studies if count is 3 or 5+ */}
                {caseStudies.length === 3 && caseStudies[2] && (
                    <div className="flex justify-center">
                        <div className={`w-1/2 relative transition-opacity duration-700 ${hoveredIndex !== null && hoveredIndex !== 2 ? 'opacity-30' : 'opacity-100'
                            }`}>
                            <CaseStudyCard
                                {...caseStudies[2]}
                                index={2}
                                isHovered={hoveredIndex === 2}
                                onHover={() => setHoveredIndex(2)}
                                onLeave={() => setHoveredIndex(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
} 