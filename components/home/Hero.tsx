// components/home/Hero.tsx
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-off-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={64}
              height={64}
              className="h-16 w-16"
              priority
            />
          </div>

          <h1 className="mb-4 font-bold tracking-tight text-primary-text">
            <span className="block text-primary-green">CampusLink</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl">
              Connect. Discover. Belong.
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-text md:text-xl">
            Your digital community for City Campus. Find your people,
            discover opportunities, and make the most of your university experience.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="bg-primary-green text-white font-medium px-8 py-3 hover:bg-deep-green transition-colors inline-flex items-center"
            >
              Join CampusLink
            </Link>
            <Link
              href="/campus"
              className="border-2 border-primary-green text-primary-green font-medium px-8 py-3 hover:bg-primary-green hover:text-white transition-colors inline-flex items-center"
            >
              Explore Campus
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-text">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
