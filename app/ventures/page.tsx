import Hero from "@/components/sections/Hero";
import VenturesGrid from "@/components/sections/VenturesGrid";
import PressSection from "@/components/sections/PressSection";
import ContentCreationSection from "@/components/sections/ContentCreationSection";
import HeroImage from "../../public/images/hero-img-ventures.png";

export default function VenturesPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title="I am currently the co-founder of two startups, and love coming up with silly ideas all the time."
        imageUrl={HeroImage.src}
        imageAlt="Ventures illustration"
      />
      <VenturesGrid />
      <PressSection />
      <ContentCreationSection />
    </div>
  );
}
