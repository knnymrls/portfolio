'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Clock } from 'lucide-react'

interface CaseStudyCardProps {
    title: string
    description: string
    readTime?: string
    color: string
    images?: string[]
    index: number
    isHovered?: boolean
    onHover?: () => void
    onLeave?: () => void
}

export default function CaseStudyCard({
    title,
    description,
    readTime,
    color,
    images = [],
    index,
    isHovered = false,
    onHover,
    onLeave
}: CaseStudyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="case-study-card bg-[#ffffff] relative rounded-[20px] h-full shrink-0 border border-[#e9e9e9]"
        >
            <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start overflow-clip px-5 py-6 relative w-full">
                {/* Image Section */}
                <div
                    className="h-[322px] overflow-clip relative rounded-[20px] shrink-0 w-full"
                    style={{ backgroundColor: color }}
                >
                    {images.length > 0 ? (
                        <div className="relative w-full h-full">
                            {images.map((image, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className="absolute bg-center bg-cover bg-no-repeat h-[481px] rounded-[20px]"
                                    style={{
                                        backgroundImage: `url('${image}')`,
                                        left: `${imgIndex * 212 + 40}px`,
                                        top: `${imgIndex * 49 - 235}px`,
                                        width: '222px'
                                    }}
                                >
                                    <div className="absolute border-2 border-[#000000] border-solid inset-[-2px] pointer-events-none rounded-[22px]" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-white text-lg font-medium">{title}</div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Title and Clock Row */}
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row gap-1 items-center">
                            <div className="relative shrink-0 size-4">
                                <div className="w-4 h-4 bg-[#333334] rounded-full" />
                            </div>
                            <div className="case-study-title font-['Sora',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#121212] text-[16px] text-left text-nowrap tracking-[0.32px]">
                                {title}
                            </div>
                        </div>
                        {readTime && (
                            <div className="case-study-readtime font-['Sora',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#6f6f6f] text-[16px] text-left text-nowrap tracking-[0.32px] flex items-center gap-1">
                                <Clock className="size-4" />
                                {readTime}
                            </div>
                        )}
                    </div>

                    {/* Description and Button Row */}
                    <div className="flex flex-row items-end justify-between gap-4 w-full">
                        <div className="case-study-description font-['Sora',_sans-serif] font-normal leading-[0] flex-1 text-[#333334] text-[20px] text-left tracking-[0.4px]">
                            <p
                                className="block leading-[normal] overflow-hidden text-ellipsis"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.4'
                                }}
                            >
                                {description}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#f1f1f1] box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-[12px] relative rounded-xl shrink-0 hover:bg-[#e5e5e5] transition-colors"
                        >
                            <ExternalLink className="size-5 text-[#333334]" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 