import Hero from "@/components/sections/Hero";
import AboutJourney from "@/components/sections/AboutJourney";
import DraggableBox from "@/components/sections/DraggableBox";
import HeroImage from "../../public/images/hero-img.png"; // Using the generic hero image for the top, bio has personal one

export default function AboutPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title="I build things for the web, sometimes they work, usually they're fun."
        imageUrl={HeroImage.src}
        imageAlt="Kenny working on a project"
      />

      <DraggableBox />

      <AboutJourney />
    </div>
  );
}
