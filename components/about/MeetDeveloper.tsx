// components/about/MeetDeveloper.tsx
import Image from 'next/image';

export function MeetDeveloper() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">Meet the Developer</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 rounded-full border-2 border-primary-green bg-primary-green/10 flex items-center justify-center text-4xl font-bold text-primary-green overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
                alt="Developer"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">[Developer Name]</h3>
            <p className="text-muted-text">Student Developer</p>
            <p className="text-muted-text">Social Work & Youth Development</p>
            <p className="text-muted-text mt-4">
              A student who built this platform independently as a personal project — 
              from a student's perspective, for students.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
