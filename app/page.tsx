import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";

export default function Home() {
  return (
    <>
      <div className="max-w-[1000px] mx-auto px-4">
        <Hero
          title={
            <>
              Yo, I&apos;m Kenny Morales
              <br />I design thoughtful AI interfaces that elevate user experiences
            </>
          }
          imageUrl="/figma-assets/621192cb53b585feaad1cfb6334638d014c1b398.png"
          imageAlt="Kenny Morales"
          imageSize={{ width: 278, height: 315 }}
          mobileImageUrl="/figma-assets/43c8ce632cc8dab8fa0d0592fbc2c219822f86f4.png"
          mobileImageSize={{ width: 88, height: 88 }}
        />
        <CaseStudies />
      </div>

      {/* Mobile Chat Input - Only visible on small screens */}
      <div className="fixed bottom-9 left-4 right-4 lg:hidden z-50">
        <div className="bg-surface rounded-[12px] border border-border flex items-center justify-between px-4 py-3 max-w-[348px]">
          <input
            type="text"
            placeholder="Ask me any question..."
            className="flex-1 bg-transparent text-base text-surface-secondary placeholder:text-surface-secondary focus:outline-none"
          />
          <button className="bg-foreground p-2 rounded-[12px] flex items-center justify-center shrink-0 ml-2">
            <img
              src="/figma-assets/c4b1ee80fdd51b57e906853e457666644df43cfd.svg"
              alt="Send"
              className="w-[14px] h-[14px]"
            />
          </button>
        </div>
      </div>
    </>
  );
}
