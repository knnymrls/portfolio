import Hero from "@/components/sections/Hero";
import VenturesGrid from "@/components/sections/VenturesGrid";
import PressSection from "@/components/sections/PressSection";
import ContentCreationSection from "@/components/sections/ContentCreationSection";
import HeroImage from "../../public/images/ventures-hero.png";
import { getVentures, getPress } from "@/lib/content/loader";

export default async function VenturesPage() {
  const [ventures, press] = await Promise.all([getVentures(), getPress()]);

  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title="I am currently the co-founder of two startups, and love coming up with silly ideas all the time."
        imageUrl={HeroImage.src}
        imageAlt="Ventures illustration"
      />
      <VenturesGrid ventures={ventures} />
      <PressSection items={press} />
      {/* <ContentCreationSection /> */}
    </div>
  );
}
