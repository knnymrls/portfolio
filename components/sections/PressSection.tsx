'use client';

const imgImage13 = "http://localhost:3845/assets/a0d2865fff9d77a7f3b389745ae464f0b8b246a3.png";
const imgImage14 = "http://localhost:3845/assets/778cd92189b051f83d245401eada88227bd8b23f.png";
const imgImage15 = "http://localhost:3845/assets/4dcee9d4caa19b2b19013c2b54a754d5acc12d3b.png";
const imgImage17 = "http://localhost:3845/assets/1db2cfac7bec21c6d3051fdc52267ec049527503.png";
const imgImage18 = "http://localhost:3845/assets/eebc416a56e9c6422d1994d359becce58e8b37cc.png";
const imgImage19 = "http://localhost:3845/assets/5aaaebbbbab89cd3d1705a752e12a7e5824f7b1d.png";

const pressItems = [
  {
    name: 'Silicon Prairie News',
    backgroundColor: 'bg-[#f59222]',
    logoUrl: imgImage13,
    logoClassName: 'w-[121px] h-[121px]'
  },
  {
    name: 'NPSA',
    backgroundColor: 'bg-[#a5a7a9]',
    logoUrl: imgImage18,
    logoClassName: 'w-[101px] h-[105px]'
  },
  {
    name: 'New York Post',
    backgroundColor: 'bg-[#cb0000]',
    logoUrl: imgImage15,
    logoClassName: 'w-[150px] h-[150px]'
  },
  {
    name: 'Fox Business',
    backgroundColor: 'bg-neutral-100',
    logoUrl: imgImage17,
    logoClassName: 'w-[124px] h-[62px]'
  },
  {
    name: 'Business Insider',
    backgroundColor: 'bg-[#002aff]',
    logoUrl: imgImage14,
    logoClassName: 'w-[156px] h-[53px]'
  },
  {
    name: 'University of Nebraska-Lincoln',
    backgroundColor: 'bg-neutral-100',
    logoUrl: imgImage19,
    logoClassName: 'w-[96px] h-[96px]'
  }
];

export default function PressSection() {
  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          ON THE PRESS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pressItems.map((press, index) => (
            <div key={index} className="bg-surface rounded-[20px] border border-border overflow-hidden h-[280px]">
              <div className="p-5 pb-6 flex flex-col h-full">
                {/* Logo Area */}
                <div className={`flex-1 ${press.backgroundColor} rounded-[20px] overflow-hidden relative flex items-center justify-center mb-4`}>
                  <img 
                    src={press.logoUrl} 
                    alt={`${press.name} logo`}
                    className={`${press.logoClassName} object-contain`}
                  />
                </div>
                
                {/* Name */}
                <h3 className="text-base font-medium text-foreground">
                  {press.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}