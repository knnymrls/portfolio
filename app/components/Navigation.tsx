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
            className="nav-container fixed backdrop-blur-xs bg-[#f8f8f8] border border-[#E4E4E7] flex items-center gap-2 p-[6px] rounded-2xl top-4 left-1/2 transform -translate-x-1/2"
            style={{ zIndex: Z_INDEX.NAVIGATION }}
        >
            <button
                onClick={() => onTabChange('work')}
                className={`flex w-[103px] items-center hover:scale-95 justify-center p-3 border border-transparent rounded-xl transition-all duration-200 ${activeTab === 'work'
                    ? 'nav-button-active'
                    : 'nav-button-inactive'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'work' ? 'font-semibold' : ''
                    }`}>
                    Work
                </span>
            </button>

            <button
                onClick={() => onTabChange('ventures')}
                className={`flex w-[103px] items-center hover:scale-95 justify-center p-3 border border-transparent rounded-xl transition-all duration-200 ${activeTab === 'ventures'
                    ? 'nav-button-active'
                    : 'nav-button-inactive'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'ventures' ? 'font-semibold' : ''
                    }`}>
                    Ventures
                </span>
            </button>

            <button
                onClick={() => onTabChange('about')}
                className={`flex w-[103px] items-center hover:scale-95 justify-center p-3 border border-transparent rounded-xl transition-all duration-200 ${activeTab === 'about'
                    ? 'nav-button-active'
                    : 'nav-button-inactive'
                    }`}
            >
                <span className={`font-medium text-base ${activeTab === 'about' ? 'font-semibold' : ''
                    }`}>
                    About
                </span>
            </button>
        </motion.div>
    )
} 