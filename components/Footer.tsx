// components/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 border-2 border-primary-green bg-white"></div>
            <span className="text-sm font-semibold text-primary-green">CampusLink</span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/about" className="text-sm text-muted-text hover:text-primary-green">About</Link>
            <Link href="/contact" className="text-sm text-muted-text hover:text-primary-green">Contact</Link>
            <Link href="/privacy" className="text-sm text-muted-text hover:text-primary-green">Privacy</Link>
          </div>
          <p className="text-sm text-muted-text mt-4 md:mt-0">
            © {new Date().getFullYear()} CampusLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
