// components/home/Hero.tsx
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';

const heroImages = [
  {
    src: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653525/DSC_8897_asrddb.jpg',
    alt: 'First Year Orientation 2026 - Students gathering at LUANAR City Campus',
    caption: 'New beginnings at LUANAR City Campus'
  },
  {
    src: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653525/DSC_8046_trhauk.jpg',
    alt: 'Orientation 2026 - Freshmen connecting at LUANAR',
    caption: 'Where lifelong connections begin'
  },
  {
    src: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653529/DSC_8912_hb7vtt.jpg',
    alt: 'LUANAR City Campus Orientation 2026 - Student community',
    caption: 'Your journey starts here'
  },
  {
    src: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653529/DSC_8890_wasu3m.jpg',
    alt: 'Orientation Week 2026 - LUANAR students exploring campus',
    caption: 'Discover your new home'
  },
  {
    src: 'https://res.cloudinary.com/dfsvnaslv/image/upload/v1788653527/DSC_9060_fw33ed.jpg',
    alt: 'LUANAR City Campus Orientation 2026 - Student life',
    caption: 'Welcome to the CampusLink community'
  }
];

export function Hero() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-custom">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 border-2 border-primary-green bg-white"></div>
          </div>
          
          <h1 className="mb-4 font-bold tracking-tight text-primary-text">
            <span className="block text-primary-green">CampusLink</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl">
              Connect. Discover. Belong.
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-text md:text-xl">
            Your digital community for LUANAR City Campus. Find your people, 
            discover opportunities, and make the most of your university experience.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/auth/register" 
              className="bg-primary-green text-white font-medium px-8 py-3 rounded-lg hover:bg-deep-green transition-colors inline-flex items-center"
            >
              Join CampusLink
            </Link>
            <Link 
              href="/campus" 
              className="border-2 border-primary-green text-primary-green font-medium px-8 py-3 rounded-lg hover:bg-primary-green hover:text-white transition-colors inline-flex items-center"
            >
              Explore City Campus
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-primary-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-green">
              Orientation 2026
            </span>
            <p className="mt-2 text-sm text-muted-text">
              Capturing the spirit of new beginnings at LUANAR City Campus
            </p>
          </div>
          <Carousel
            images={heroImages}
            autoPlay
            interval={5000}
            showArrows
            showDots
            className="overflow-hidden rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
