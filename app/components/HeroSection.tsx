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

            {/* Interactive Tech Stack Visualization */}
            <div className="relative w-[400px] h-[300px] hidden lg:block">
                {/* Floating Tech Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute top-0 left-0 z-10"
                >
                    <motion.div
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                    >
                        <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-1">⚡</div>
                            <div className="text-sm font-semibold">Next.js</div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute top-[120px] left-[20px] z-20"
                >
                    <motion.div
                        animate={{ 
                            y: [0, 10, 0],
                            rotate: [0, -3, 0]
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                        className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                    >
                        <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-1">🧠</div>
                            <div className="text-sm font-semibold">AI/ML</div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="absolute top-[30px] right-0 z-30"
                >
                    <motion.div
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 2, 0]
                        }}
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                    >
                        <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-1">⚛️</div>
                            <div className="text-sm font-semibold">React</div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="absolute top-[180px] right-[40px] z-40"
                >
                    <motion.div
                        animate={{ 
                            y: [0, 12, 0],
                            rotate: [0, -4, 0]
                        }}
                        transition={{ 
                            duration: 4.5, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: 1.5
                        }}
                        className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                    >
                        <div className="text-white text-center">
                            <div className="text-2xl font-bold mb-1">🔷</div>
                            <div className="text-sm font-semibold">TypeScript</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Floating Code Snippet */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3, duration: 1 }}
                    className="absolute bottom-0 left-[100px] z-50"
                >
                    <motion.div
                        animate={{ 
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                            duration: 6, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="bg-gray-900/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-gray-700"
                    >
                        <div className="font-mono text-xs text-green-400">
                            <div className="text-gray-500 mb-1">// Building the future</div>
                            <div className="text-blue-400">const</div>
                            <span className="text-white"> magic = </span>
                            <span className="text-green-300">await</span>
                            <br />
                            <div className="ml-2">
                                <span className="text-purple-400">AI</span>
                                <span className="text-white">.</span>
                                <span className="text-yellow-400">create</span>
                                <span className="text-white">(</span>
                                <span className="text-orange-400">'amazing'</span>
                                <span className="text-white">)</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Decorative Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                            y: [0, -20, -40]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                            left: `${20 + i * 60}px`,
                            top: `${250 + (i % 2) * 20}px`,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    )
} 