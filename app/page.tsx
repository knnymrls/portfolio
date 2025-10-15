import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";

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
        imageUrl="/figma-assets/43c8ce632cc8dab8fa0d0592fbc2c219822f86f4.png"
        imageAlt="Kenny Morales"
        imageSize={{ width: 88, height: 88 }}
      />
      <CaseStudies />
    </div>
  );
}
