// MDX Components for Case Studies
// These are auto-available in all case study MDX files

import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudyImage from "@/components/case-study/CaseStudyImage";
import CaseStudyVideo from "@/components/case-study/CaseStudyVideo";
import CaseStudyCallout from "@/components/case-study/CaseStudyCallout";
import CaseStudyStats from "@/components/case-study/CaseStudyStats";
import CaseStudyPersonas from "@/components/case-study/CaseStudyPersonas";
import CaseStudyColorPalette from "@/components/case-study/CaseStudyColorPalette";
import CaseStudyProcessTimeline from "@/components/case-study/CaseStudyProcessTimeline";
import CaseStudyTestimonial from "@/components/case-study/CaseStudyTestimonial";
import DataPipelineDiagram from "@/components/case-study/DataPipelineDiagram";
import DataStatsVisualization from "@/components/case-study/DataStatsVisualization";
import StudentProfileDiagram from "@/components/case-study/StudentProfileDiagram";
import {
  V1AlgorithmDiagram,
  V2AlgorithmDiagram,
} from "@/components/case-study/MatchingAlgorithmDiagram";
import type { MDXComponents } from "mdx/types";

// Case study specific components
export const caseStudyComponents: MDXComponents = {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  CaseStudyImage,
  CaseStudyVideo,
  CaseStudyCallout,
  CaseStudyStats,
  CaseStudyPersonas,
  CaseStudyColorPalette,
  CaseStudyProcessTimeline,
  CaseStudyTestimonial,
  DataPipelineDiagram,
  DataStatsVisualization,
  StudentProfileDiagram,
  V1AlgorithmDiagram,
  V2AlgorithmDiagram,

  // Base typography styling
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-bold mb-4 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mt-10 mb-4 text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold mt-8 mb-3 text-foreground/90">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-base text-foreground/90 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-foreground/90">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground/90">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80 my-4">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-surface-secondary/20 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-surface-secondary/10 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
};

export default caseStudyComponents;
