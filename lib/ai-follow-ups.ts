/**
 * Generate contextually relevant follow-up questions based on the AI's response.
 * These are fallbacks when the AI doesn't suggest its own follow-ups.
 *
 * Structure:
 * 1. DEEPER - dig into the current topic
 * 2. CONTEXTUAL NAV - navigate/highlight within the same topic
 * 3. UNRELATED - something completely different
 */
export function generateSmartFollowUps(
  lastResponse: string,
  currentPage: string
): string[] {
  const response = lastResponse.toLowerCase();

  // 1. DEEPER question based on what was just discussed
  let deeper = "Tell me more about that";

  if (response.includes("findu")) {
    if (response.includes("tech") || response.includes("stack")) {
      deeper = "What challenges did you face building FindU?";
    } else if (response.includes("user") || response.includes("growth")) {
      deeper = "How did you acquire your first users?";
    } else {
      deeper = "What's the tech stack behind FindU?";
    }
  } else if (response.includes("mkrs") || response.includes("agency")) {
    deeper = response.includes("client")
      ? "What types of projects do you take on?"
      : "Tell me about your favorite client project";
  } else if (response.includes("flock")) {
    deeper = "How does Flock's AI scheduling work?";
  } else if (response.includes("bloom")) {
    deeper = "What did you learn from building Bloom?";
  } else if (response.includes("skill") || response.includes("experience")) {
    deeper = "What technologies are you most excited about?";
  } else if (response.includes("venture") || response.includes("startup")) {
    deeper = "Which venture are you most proud of?";
  } else if (response.includes("contact")) {
    deeper = "What kind of projects interest you most?";
  }

  // 2. CONTEXTUAL NAV - navigate/highlight within the same topic
  let contextualNav = "Show me the case study";

  if (response.includes("findu")) {
    contextualNav = "Take me to the FindU case study";
  } else if (response.includes("mkrs")) {
    contextualNav = "Show me the Mkrs project details";
  } else if (response.includes("flock")) {
    contextualNav = "Take me to the Flock case study";
  } else if (response.includes("bloom")) {
    contextualNav = "Show me the Bloom project";
  } else if (response.includes("skill")) {
    contextualNav = "Highlight your top skills";
  } else if (response.includes("venture") || response.includes("startup")) {
    contextualNav = "Show me all your ventures";
  } else if (currentPage.includes("/projects/findu")) {
    contextualNav = "Show me the results section";
  } else if (currentPage.includes("/projects/")) {
    contextualNav = "Take me to the solution section";
  }

  // 3. UNRELATED - something completely different from current context
  let unrelated = "What are you currently working on?";

  if (response.includes("findu") || currentPage.includes("/projects/findu")) {
    unrelated = "Tell me about Mkrs";
  } else if (response.includes("mkrs") || currentPage.includes("/projects/mkrs")) {
    unrelated = "What are your top skills?";
  } else if (response.includes("flock") || response.includes("bloom")) {
    unrelated = "Show me your ventures";
  } else if (response.includes("skill") || currentPage === "/skills") {
    unrelated = "Tell me about FindU";
  } else if (response.includes("venture") || currentPage === "/ventures") {
    unrelated = "What's your design philosophy?";
  } else if (currentPage === "/about") {
    unrelated = "Show me the FindU case study";
  } else if (currentPage === "/contact") {
    unrelated = "What projects are you most proud of?";
  }

  return [deeper, contextualNav, unrelated];
}