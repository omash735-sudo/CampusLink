// components/home/Hero.tsx
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#f6faf7] via-off-white to-white">
      {/* Decorative soft green wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary-green/8 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-green/10 blur-3xl"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/70 flex items-center justify-center shadow-[0_4px_20px_-12px_rgba(23,107,58,0.25)]">
              <Image
                src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
                alt="CampusLink"
                width={64}
                height={64}
                className="h-12 w-12 md:h-14 md:w-14"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green text-xs font-medium px-3 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-green" />
            LUANAR City Campus
          </div>

          <h1 className="mb-5 font-bold tracking-tight text-primary-text">
            <span className="block text-primary-green text-xl md:text-2xl mb-2">
              CampusLink
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Connect. Discover.{' '}
              <span className="text-primary-green">Belong.</span>
            </span>
          </h1>

          <p className="mx-auto mb-9 max-w-2xl text-base md:text-lg text-muted-text leading-relaxed">
            Your digital community for City Campus. Find your people,
            discover opportunities, and make the most of your university
            experience.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-primary-green text-white font-medium px-8 py-3.5 hover:bg-deep-green hover:shadow-[0_8px_24px_-12px_rgba(23,107,58,0.4)] transition-all inline-flex items-center justify-center"
            >
              Join CampusLink
            </Link>
            <Link
              href="/campus"
              className="w-full sm:w-auto bg-white/70 backdrop-blur-md border-2 border-primary-green text-primary-green font-medium px-8 py-3.5 hover:bg-primary-green hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Explore Campus
            </Link>
          </div>

          <p className="mt-7 text-sm text-muted-text">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary-green hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
