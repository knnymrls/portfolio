'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ExperimentsSection from './components/ExperimentsSection'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'work' | 'ventures' | 'about'>('work')

  return (
    <div className="bg-[#fbfbfb] relative size-full min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative box-border content-stretch flex flex-col gap-[108px] items-start justify-start p-0 top-[165px] w-full max-w-[1000px] mx-auto px-6">
        <HeroSection />

        <CaseStudiesSection />

        <ExperimentsSection />
      </div>
    </div>
  )
}