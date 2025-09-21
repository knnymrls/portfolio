import { portfolioKnowledge } from '@/data/portfolio-knowledge';

type Context = {
  currentPage: string;
  lastResponse?: string;
  hasNavigated?: boolean;
};

export function getContextualFollowUpQuestions(context: Context): string[] {
  const { currentPage, lastResponse = '', hasNavigated } = context;
  const allQuestions: string[] = [];
  
  // Page-specific questions
  switch (currentPage) {
    case '/':
      allQuestions.push(
        "Tell me more about FindU",
        "What's the tech stack for these projects?",
        "Show me his ventures",
        "What makes Mkrs unique?",
        "How can I work with Kenny?"
      );
      break;
      
    case '/ventures':
      allQuestions.push(
        "What's the story behind FindU?",
        `What stage is ${portfolioKnowledge.ventures.current[0].name} at?`,
        "How did he raise $2.5M?",
        "Is he looking for investors?",
        "Tell me about Mkrs consulting"
      );
      break;
      
    case '/skills':
      allQuestions.push(
        "What AI/ML tools does he use?",
        "Show me his project examples",
        "What's his strongest skill?",
        "Does he do freelance work?",
        "What frameworks is he expert in?"
      );
      break;
      
    case '/about':
      allQuestions.push(
        "What's his entrepreneurship experience?",
        "Show me his projects",
        "How can I contact him?",
        "What content does he create?",
        "Tell me about his community work"
      );
      break;
      
    case '/contact':
      allQuestions.push(
        "What's his availability?",
        "What projects interest him?",
        "Show me his work",
        "What's his response time?",
        "Can he help with AI projects?"
      );
      break;
      
    default:
      // General questions
      allQuestions.push(
        "Show me Kenny's projects",
        "What are his technical skills?",
        "Tell me about his ventures",
        "How can I contact him?",
        "What's his background?"
      );
  }
  
  // Response-based questions (analyze what the AI just talked about)
  const lowerResponse = lastResponse.toLowerCase();
  
  if (lowerResponse.includes('findu')) {
    allQuestions.push("What technologies power FindU?", "How many users does FindU have?");
  }
  
  if (lowerResponse.includes('mkrs')) {
    allQuestions.push("What services does Mkrs offer?", "Can Mkrs help with my project?");
  }
  
  if (lowerResponse.includes('skill') || lowerResponse.includes('tech')) {
    allQuestions.push("Show me project examples", "What's his experience level?");
  }
  
  if (lowerResponse.includes('contact') || lowerResponse.includes('work')) {
    allQuestions.push("What's his hourly rate?", "Is he available for consulting?");
  }
  
  // If just navigated, suggest exploring
  if (hasNavigated) {
    allQuestions.push("Tell me more about this section", "What should I know here?");
  }
  
  // Add some project-specific questions
  portfolioKnowledge.projects.forEach(project => {
    if (!allQuestions.some(q => q.includes(project.name))) {
      allQuestions.push(`Tell me about ${project.name}`);
    }
  });
  
  // Remove duplicates and return 3 most relevant
  const uniqueQuestions = [...new Set(allQuestions)];
  
  // Prioritize questions related to the current context
  const prioritizedQuestions = uniqueQuestions.sort((a, b) => {
    const aRelevance = (a.toLowerCase().includes(currentPage.slice(1)) ? 2 : 0) +
                       (lowerResponse && a.toLowerCase().includes(lowerResponse.split(' ')[0]) ? 1 : 0);
    const bRelevance = (b.toLowerCase().includes(currentPage.slice(1)) ? 2 : 0) +
                       (lowerResponse && b.toLowerCase().includes(lowerResponse.split(' ')[0]) ? 1 : 0);
    return bRelevance - aRelevance;
  });
  
  // Return top 3, with some randomization for variety
  const topQuestions = prioritizedQuestions.slice(0, 6);
  return topQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}