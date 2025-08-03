'use client'

import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, FileText } from 'lucide-react'

export default function HeroSection() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="box-border content-stretch flex flex-col lg:flex-row gap-9 items-start justify-start p-0 relative shrink-0 w-full"
        >
            <motion.div
                variants={fadeInUp}
                className="box-border content-stretch flex flex-col gap-9 items-start justify-start p-0 relative shrink-0"
            >
                <motion.div
                    variants={fadeInUp}
                    className="hero-text font-['Sora',_sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#333334] text-[24px] md:text-[30px] lg:text-[36px] text-left w-full lg:w-[607px]"
                >
                    <p className="block mb-0">Yo, I'm Kenny Morales</p>
                    <p className="block mb-0">I design thoughtful AI interfaces</p>
                    <p className="block">that elevate user experiences</p>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary box-border content-stretch flex flex-row gap-2 items-center justify-center p-[16px] relative rounded-[13px] shrink-0 transition-colors"
                    >
                        <Mail className="size-4 icon-light" />
                        <div className="font-['Sora',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-left text-nowrap tracking-[0.32px]">
                            Reach out
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[12px] relative rounded-[13px] shrink-0 transition-colors"
                    >
                        <Github className="size-7" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[12px] relative rounded-[13px] shrink-0 transition-colors"
                    >
                        <Linkedin className="size-7" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[12px] relative rounded-[13px] shrink-0 transition-colors"
                    >
                        <FileText className="size-6" />
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Floating Images */}
            <div className="relative w-[400px] h-[300px] hidden lg:block">
                <motion.div
                    initial={{ opacity: 0, rotate: -5 }}
                    animate={{ opacity: 1, rotate: 4 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute top-[-20px] left-0 z-10"
                >
                    <div className="rotate-[0deg]">
                        <div
                            className="h-[137px] relative rounded-[20px] w-[167px]"
                            style={{
                                backgroundImage: "url('http://localhost:3845/assets/5af051d79c50db86a1e01acb3ef84801dfae2e50.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            <div className="absolute pointer-events-none rounded-[23px]" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, rotate: 5 }}
                    animate={{ opacity: 1, rotate: -5 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute top-[150px] left-[10px] z-20"
                >
                    <div className="rotate-[355deg]">
                        <div
                            className="h-[100.857px] relative rounded-[20px] w-[123.27px]"
                            style={{
                                backgroundImage: "url('http://localhost:3845/assets/66fff5c0a940e6712a8a99dc052f5b6cc11b4c9c.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            <div className="absolute pointer-events-none rounded-[23px]" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, rotate: -3 }}
                    animate={{ opacity: 1, rotate: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="absolute top-[20px] left-[150px] z-30"
                >
                    <div className="rotate-[1deg]">
                        <div
                            className="h-[200.128px] relative rounded-[20px] w-[187.315px]"
                            style={{
                                backgroundImage: "url('http://localhost:3845/assets/d282545491c5de33b6b0a64cd574ea384ba79637.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            <div className="absolute pointer-events-none rounded-[23px]" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
} 