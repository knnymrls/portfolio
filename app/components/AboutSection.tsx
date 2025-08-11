'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Coffee, Code, Zap } from 'lucide-react'

export default function AboutSection() {
  const skills = [
    { category: 'AI & ML', items: ['OpenAI GPT', 'LangChain', 'Vector DBs', 'Embeddings'] },
    { category: 'Frontend', items: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
    { category: 'Cloud & DevOps', items: ['AWS', 'Vercel', 'Docker', 'CI/CD'] },
  ]

  const experience = [
    {
      role: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description: 'Building AI-powered applications and helping startups implement intelligent features.'
    },
    {
      role: 'Student',
      company: 'Learning & Building',
      period: '2020 - Present',
      description: 'Continuously learning new technologies and building projects to solve real-world problems.'
    }
  ]

  const interests = [
    { icon: Code, label: 'AI & Machine Learning', description: 'Exploring the frontier of intelligent systems' },
    { icon: Zap, label: 'Product Innovation', description: 'Creating solutions that make a real difference' },
    { icon: Coffee, label: 'Entrepreneurship', description: 'Building ventures that solve real problems' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Hero */}
      <div className="mb-12 text-center">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          About Kenny
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          I'm a full-stack developer passionate about AI and building products that solve real problems. 
          I love exploring the intersection of technology and human experience.
        </motion.p>
      </div>

      {/* Location & Contact */}
      <motion.div 
        className="flex flex-wrap justify-center gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <MapPin className="w-5 h-5" />
          <span>San Francisco, CA</span>
        </div>
        <a 
          href="mailto:kenny@example.com" 
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>kenny@example.com</span>
        </a>
        <a 
          href="https://github.com/knnymrls" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </a>
        <a 
          href="https://linkedin.com/in/kennymorales" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
          <span>LinkedIn</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills & Technologies</h2>
          <div className="space-y-6">
            {skills.map((skillGroup, index) => (
              <div key={skillGroup.category}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.period}
                  </span>
                </div>
                <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {exp.company}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">What I'm Passionate About</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interests.map((interest, index) => {
            const IconComponent = interest.icon
            return (
              <div key={interest.label} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {interest.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {interest.description}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Let's Build Something Amazing Together
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          I'm always interested in collaborating on innovative projects, especially those involving AI and emerging technologies.
        </p>
        <a
          href="mailto:kenny@example.com"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          <Mail className="w-5 h-5" />
          Get In Touch
        </a>
      </motion.div>
    </motion.div>
  )
}