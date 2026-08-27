// components/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 border-2 border-primary-green bg-white"></div>
            <span className="text-sm font-semibold text-primary-green">CampusLink</span>
            <span className="text-sm text-muted-text">Connect. Discover. Belong.</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6 mt-4 md:mt-0">
            <Link href="/about" className="text-sm text-muted-text hover:text-primary-green transition-colors">
              About
            </Link>
            <Link href="/campus" className="text-sm text-muted-text hover:text-primary-green transition-colors">
              Campus
            </Link>
            <Link href="/events" className="text-sm text-muted-text hover:text-primary-green transition-colors">
              Events
            </Link>
            <Link href="/resources" className="text-sm text-muted-text hover:text-primary-green transition-colors">
              Resources
            </Link>
            <Link href="/contact" className="text-sm text-muted-text hover:text-primary-green transition-colors">
              Contact
            </Link>
          </div>
          
          <p className="text-sm text-muted-text mt-4 md:mt-0">
            © {new Date().getFullYear()} CampusLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
