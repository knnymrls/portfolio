'use client'

import { motion } from 'framer-motion'
import { TabType } from '../types'
import { Z_INDEX } from '../constants'

interface NavigationProps {
    activeTab: TabType
    onTabChange: (tab: TabType) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed backdrop-blur-sm bg-[#f1f1f1]/50 flex items-center gap-2 p-[6px] rounded-2xl top-4 left-1/2 transform -translate-x-1/2"
            style={{ zIndex: Z_INDEX.NAVIGATION }}
        >
            <button
                onClick={() => onTabChange('work')}
                className={`flex w-[103px] items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'work'
                    ? 'bg-white'
                    : 'hover:bg-white/50'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'work' ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                    Work
                </span>
            </button>

            <button
                onClick={() => onTabChange('ventures')}
                className={`flex w-[103px] items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'ventures'
                    ? 'bg-white'
                    : 'hover:bg-white/50'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'ventures' ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                    Ventures
                </span>
            </button>

            <button
                onClick={() => onTabChange('about')}
                className={`flex w-[103px] items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'about'
                    ? 'bg-white'
                    : 'hover:bg-white/50'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'about' ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                    About
                </span>
            </button>
        </motion.div>
    )
} 