import { AIAction } from "@/types/ai";

export type NavigationTarget = 
  | "home"
  | "projects" 
  | "ventures"
  | "skills"
  | "about"
  | "contact";

export interface NavigationHandler {
  navigate: (target: NavigationTarget) => void;
  highlight: (elementIds: string[], duration?: number) => void;
  clearHighlight: () => void;
}

export const createNavigationHandler = (): NavigationHandler => {
  const navigate = (target: NavigationTarget) => {
    // For Next.js app router, we'll use the router
    const targetPath = target === "home" ? "/" : `/${target}`;
    
    // We'll need to pass this through props or context
    // For now, we'll use window.location for immediate functionality
    if (typeof window !== "undefined") {
      window.location.href = targetPath;
    }
  };

  const highlight = (elementIds: string[], duration = 3000) => {
    if (typeof window === "undefined") return;

    // Add highlight class to specific elements
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.add("ai-highlight");
        
        // Add opacity to other elements
        document.querySelectorAll(".highlightable").forEach(el => {
          if (!elementIds.includes(el.id)) {
            el.classList.add("ai-dimmed");
          }
        });
      }
    });

    // Auto-clear after duration
    if (duration > 0) {
      setTimeout(() => {
        clearHighlight();
      }, duration);
    }
  };

  const clearHighlight = () => {
    if (typeof window === "undefined") return;

    document.querySelectorAll(".ai-highlight").forEach(el => {
      el.classList.remove("ai-highlight");
    });
    
    document.querySelectorAll(".ai-dimmed").forEach(el => {
      el.classList.remove("ai-dimmed");
    });
  };

  return { navigate, highlight, clearHighlight };
};