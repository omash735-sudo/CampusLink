// app/about/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { AboutHero } from '@/components/about/AboutHero';
import { WhatIsThis } from '@/components/about/WhatIsThis';
import { TheProblem } from '@/components/about/TheProblem';
import { WhyIBuiltThis } from '@/components/about/WhyIBuiltThis';
import { MeetDeveloper } from '@/components/about/MeetDeveloper';
import { StudentPerspective } from '@/components/about/StudentPerspective';
import { WhereItStarted } from '@/components/about/WhereItStarted';
import { WhatWeAreBuilding } from '@/components/about/WhatWeAreBuilding';
import { Mission } from '@/components/about/Mission';
import { WhatMakesDifferent } from '@/components/about/WhatMakesDifferent';
import { StillBuilding } from '@/components/about/StillBuilding';
import { WhereWeAreGoing } from '@/components/about/WhereWeAreGoing';
import { HelpShape } from '@/components/about/HelpShape';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <AboutHero />
      <WhatIsThis />
      <TheProblem />
      <WhyIBuiltThis />
      <MeetDeveloper />
      <StudentPerspective />
      <WhereItStarted />
      <WhatWeAreBuilding />
      <Mission />
      <WhatMakesDifferent />
      <StillBuilding />
      <WhereWeAreGoing />
      <HelpShape />
    </div>
  );
}
