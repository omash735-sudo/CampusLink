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
                alt="Omash Mashiri"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Omash Mashiri</h3>
            <p className="text-muted-text">Student Developer · Social Work & Youth Development</p>
            <div className="mt-4 space-y-4 text-muted-text">
              <p>
                CampusLink is a project that started from curiosity, creativity, and a desire to build something useful for students.
              </p>
              <p>
                I'm a Social Work & Youth Development student with an interest in technology, creativity, and problem solving. I don't come from a traditional software development background. CampusLink started as a personal project and a hobby that grew into something much bigger than I initially expected.
              </p>
              <p>
                One of the earliest inspirations for the idea came from a fellow student who created her own student focused platform, MentiMW.org. Seeing her take the initiative to create something aimed at helping students made me think about what I could build from my own perspective and for my own campus.
              </p>
              <p>
                I spoke to her about my idea, and she gave me permission to pursue it. From there, CampusLink became my own concept, shaped by my experiences as a student, the challenges I see around university life, and my ideas about how technology could make some of those experiences easier.
              </p>
              <p>
                The goal isn't simply to create another university website. It's to build a connected digital space where students can find people, discover resources, learn from others, explore their campus, keep up with what is happening, and ultimately feel more connected to university life.
              </p>
              <p>
                I'm building CampusLink alongside my studies, learning and improving as the project evolves. Some parts are still experimental, some ideas will change, and new possibilities will continue to emerge. That's part of what makes the project meaningful to me.
              </p>
              <p>
                CampusLink is ultimately about the students, but it is also a reflection of what can happen when a student sees a problem, gets an idea, and decides to build something.
              </p>
              <div className="border-l-4 border-primary-green pl-4 py-2 bg-off-white mt-4">
                <p className="text-sm italic">
                  "Built by a student. Inspired by campus life. Driven by the idea that technology can bring people, knowledge, and community closer together."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
