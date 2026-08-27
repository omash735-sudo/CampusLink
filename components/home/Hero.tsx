// components/home/Hero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

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
            <Button href="/register" variant="primary" size="lg">
              Join CampusLink
            </Button>
            <Button href="/campus" variant="secondary" size="lg">
              Explore City Campus
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
