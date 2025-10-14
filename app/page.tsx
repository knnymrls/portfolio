import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";
import HeroImage from "../public/images/hero-kenny.png";

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title={
          <>
            Yo, I&apos;m Kenny Morales
            <br />I design thoughtful AI interfaces that elevate user experiences
          </>
        }
        imageSrc={HeroImage}
        imageAlt="Kenny Morales"
      />
      <CaseStudies />
    </div>
  );
}
