import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";
import SkillsOverview from "@/components/sections/SkillsOverview";
import HeroImage from "../public/images/work-hero.png";

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title="Yo, I'm Kenny Morales, I design thoughtful AI interfaces that elevate user experiences."
        imageUrl={HeroImage.src}
        imageAlt="Kenny working on a project"
      />

      <CaseStudies />

      <SkillsOverview />
    </div>
  );
}
