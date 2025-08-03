import { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'findu-highschool',
    title: 'FindU',
    description: 'Helping GenZ figure out their next steps after graduating high school.',
    summary: 'A comprehensive platform designed to guide high school graduates through post-graduation decisions. Features personalized recommendations and gamified exploration of career and education paths.',
    category: 'case-study',
    color: '#e16b6b',
    tags: ['Education', 'GenZ', 'Career Guidance'],
    readTime: '15 min',
    images: [
      'http://localhost:3845/assets/a9792dee424d8b14c8ab19e719dc092baa735c8b.png',
      'http://localhost:3845/assets/a9792dee424d8b14c8ab19e719dc092baa735c8b.png'
    ],
    defaultSize: 1.2,
    hoveredSize: 1.8
  },
  {
    id: 'nural',
    title: 'Nural',
    description: 'A innovative chat-based way of learning and analyzing stocks.',
    summary: 'An AI-powered conversational interface that makes stock market analysis accessible to beginners. Users can ask questions in natural language and receive comprehensive market insights.',
    category: 'case-study',
    color: '#4ab33c',
    tags: ['FinTech', 'AI', 'Stock Analysis'],
    readTime: '5 min',
    defaultSize: 0.8,
    hoveredSize: 1.2
  },
  {
    id: 'flock',
    title: 'Flock',
    description: 'Helping teams find time to meet using AI',
    summary: 'A smart scheduling tool that uses machine learning to optimize team meeting times across different time zones. Integrates with popular calendar apps for seamless workflow.',
    category: 'case-study',
    color: '#73d8e3',
    tags: ['Productivity', 'AI', 'Team Collaboration'],
    readTime: '5 min',
    defaultSize: 0.8,
    hoveredSize: 1.2
  },
  {
    id: 'findu-college',
    title: 'FindU',
    description: 'Helping students find the perfect college through personalization and gamification.',
    summary: 'An evolved version focusing on college selection with advanced matching algorithms and gamified decision-making tools. Features virtual campus tours and peer comparison systems.',
    category: 'case-study',
    color: '#ffb4a2',
    tags: ['Education', 'College', 'Personalization'],
    readTime: '15 min',
    defaultSize: 1.2,
    hoveredSize: 1.8
  }
]

export const getProjectsByCategory = (category: 'case-study' | 'experiment') => {
  return projects.filter(project => project.category === category)
}

export const getProjectById = (id: string) => {
  return projects.find(project => project.id === id)
}