// components/about/HelpShape.tsx
import Link from 'next/link';

export function HelpShape() {
  return (
    <section className="py-16 bg-off-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">Help Shape the Platform</h2>
        <p className="text-muted-text mb-6">
          Have an idea? Found something that doesn't work? Know something that should be added?
        </p>
        <Link
          href="/contact"
          className="bg-primary-green text-white px-8 py-3 font-medium hover:bg-deep-green transition-colors inline-block"
        >
          Send Feedback
        </Link>
      </div>
    </section>
  );
}
