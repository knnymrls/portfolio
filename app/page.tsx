import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";
import HeroImage from "../public/images/hero-img.png";

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-4">
      <Hero
        title={
          <>
            Yo, I'm Kenny Morales
            <br />I design and develop AI interfaces that create value.
          </>
        }
        imageSrc={HeroImage}
        imageAlt="Kenny Morales"
      />
      <CaseStudies />
    </div>
  );
}
