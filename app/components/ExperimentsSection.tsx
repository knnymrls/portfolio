'use client'

import { motion } from 'framer-motion'

export default function ExperimentsSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-['Sora',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#6f6f6f] text-[16px] text-left text-nowrap tracking-[0.32px]"
            >
                EXPERIMENTS
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start p-[16px] relative rounded-[20px] shrink-0 w-full border border-[#e9e9e9]"
            >
                <div className="box-border content-stretch flex flex-col gap-4 items-start justify-center p-0 relative shrink-0 w-full">
                    {/* First Row */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="box-border content-stretch flex flex-col lg:flex-row gap-4 items-start justify-start overflow-clip p-0 relative rounded-[20px] shrink-0 w-full"
                    >
                        <div className="bg-gradient-to-br from-pink-200 to-red-200 h-[432px] rounded-[20px] shrink-0 w-full lg:w-[458px] shadow-sm" />
                        <div className="basis-0 bg-gradient-to-br from-pink-200 to-red-200 grow min-h-px min-w-px rounded-[20px] self-stretch shrink-0 shadow-sm" />
                    </motion.div>

                    {/* Second Row */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-[#ffffff] box-border content-stretch flex flex-col lg:flex-row gap-4 h-[299px] items-start justify-start overflow-clip p-0 relative rounded-[20px] shrink-0 w-full border border-[#e9e9e9]"
                    >
                        <div className="basis-0 bg-gradient-to-br from-pink-200 to-red-200 grow h-full min-h-px min-w-px rounded-[20px] shrink-0 shadow-sm" />
                        <div className="bg-gradient-to-br from-pink-200 to-red-200 h-full rounded-[20px] shrink-0 w-full lg:w-[416px] shadow-sm" />
                        <div className="basis-0 bg-gradient-to-br from-pink-200 to-red-200 grow h-full min-h-px min-w-px rounded-[20px] shrink-0 shadow-sm" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
} 