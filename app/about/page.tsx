import Hero from "@/components/sections/Hero";
import AboutBio from "@/components/sections/AboutBio";
import DraggableBox from "@/components/sections/DraggableBox";
import HeroImage from "../../public/images/about-hero.png";

export default function AboutPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4" data-highlight-section="about">
      <Hero
        title="I build things for the web, sometimes they work, usually they're fun."
        imageUrl={HeroImage.src}
        imageAlt="Kenny working on a project"
      />

      <AboutBio />

      <DraggableBox />
    </div>
  );
}
