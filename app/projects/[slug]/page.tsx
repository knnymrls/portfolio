import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCaseStudy, getCaseStudies } from "@/lib/content/loader";
import { caseStudyComponents } from "@/lib/content/mdx-components";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";

// Custom logo components for specific case studies
import FindUHero from "@/components/case-study/findu/FindUHero";

// Map of custom logo component names to actual components
const customLogoComponents: Record<string, React.ComponentType<{ title: string; description: string; role: string; timeline: string; tags: string[] }>> = {
  FindUHero,
};

// Generate static params for all case studies
export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

// Generate metadata for each case study
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} Case Study | Kenny Morales`,
    description: caseStudy.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  // Check if this case study has a custom hero component
  const CustomHeroComponent = caseStudy.hero.customLogoComponent
    ? customLogoComponents[caseStudy.hero.customLogoComponent]
    : null;

  return (
    <CaseStudyLayout>
      {/* Render custom hero or standard hero */}
      {CustomHeroComponent ? (
        <CustomHeroComponent
          title={caseStudy.title}
          description={caseStudy.description}
          role={caseStudy.role}
          timeline={caseStudy.timeline}
          tags={caseStudy.tags}
        />
      ) : (
        <CaseStudyHero
          title={caseStudy.title}
          description={caseStudy.description}
          backgroundColor={caseStudy.hero.backgroundColor}
          logoUrl={caseStudy.hero.logoUrl}
          duration={caseStudy.duration}
          role={caseStudy.role}
          timeline={caseStudy.timeline}
          tags={caseStudy.tags}
        />
      )}

      {/* Render MDX content */}
      {caseStudy.content && (
        <MDXRemote source={caseStudy.content} components={caseStudyComponents} />
      )}
    </CaseStudyLayout>
  );
}
