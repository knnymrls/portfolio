import Hero from "@/components/sections/Hero";
import VenturesGrid from "@/components/sections/VenturesGrid";
import PressSection from "@/components/sections/PressSection";
import ContentCreationSection from "@/components/sections/ContentCreationSection";

const imgVector22 =
  "http://localhost:3845/assets/9b9485d22a9d40fa3cac6e46d7528ef4abfec1f4.png";

export default function VenturesPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title="I am currently the co-founder of two startups, and love coming up with silly ideas all the time."
        imageUrl={imgVector22}
        imageAlt="Ventures illustration"
      />
      <VenturesGrid />
      <PressSection />
      <ContentCreationSection />
    </div>
  );
}
