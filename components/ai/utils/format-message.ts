import React from "react";

/**
 * Parse markdown-style bold text (**text**) and render as React elements.
 * Returns null if text is empty/undefined.
 */
export function formatMessageText(text: string): React.ReactNode {
  if (!text) return null;

  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return React.createElement(
        "strong",
        { key: i, className: "font-semibold text-primary" },
        part.slice(2, -2)
      );
    }
    return part;
  });
}
