// Alternative approach: Generate follow-up questions based on the AI's response
export function generateSmartFollowUps(
  lastResponse: string,
  currentPage: string
): string[] {
  const questions: string[] = [];
  const response = lastResponse.toLowerCase();

  // Context-based questions
  if (response.includes('findu')) {
    questions.push("FindU's tech stack?", "User growth story?", "Funding details?");
  } else if (response.includes('mkrs')) {
    questions.push("Mkrs services?", "Client examples?", "Project types?");
  } else if (response.includes('creators')) {
    questions.push("Join Creators?", "Community size?", "Learning resources?");
  } else if (response.includes('skill')) {
    questions.push("Project examples?", "Years experience?", "Best framework?");
  } else if (response.includes('contact')) {
    questions.push("Response time?", "Project types?", "Availability?");
  }

  // Page-based fallbacks
  if (questions.length === 0) {
    switch (currentPage) {
      case '/':
        questions.push("See projects", "His ventures?", "Contact Kenny?");
        break;
      case '/ventures':
        questions.push("Startup details?", "Join team?", "Investment info?");
        break;
      case '/skills':
        questions.push("AI expertise?", "Project examples?", "Tech stack?");
        break;
      default:
        questions.push("View portfolio", "Kenny's skills?", "Get in touch?");
    }
  }

  // Ensure we have exactly 3 questions
  return questions.slice(0, 3);
}