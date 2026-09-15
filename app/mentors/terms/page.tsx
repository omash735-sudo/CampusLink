// app/mentors/terms/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function MentorTermsPage() {
  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold">Mentor Terms and Guidelines</h1>
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-10 space-y-6 text-primary-text">
          <section>
            <h2 className="text-xl font-bold mb-2">Independent Platform</h2>
            <p className="text-muted-text leading-relaxed">
              CampusLink is an independent student-focused platform. Becoming a
              mentor on CampusLink does not make you an employee, officer,
              agent, or official representative of CampusLink, of any
              university, or of any other institution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Voluntary Role</h2>
            <p className="text-muted-text leading-relaxed">
              Mentoring through CampusLink is voluntary. You are free to accept
              or decline any mentorship request, to set your own availability,
              and to discontinue mentoring at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Your Responsibilities</h2>
            <ul className="list-disc pl-5 text-muted-text space-y-1">
              <li>Provide accurate information about your experience and expertise.</li>
              <li>Communicate honestly and respectfully with students.</li>
              <li>Do not misrepresent your relationship with any institution.</li>
              <li>Do not provide professional advice (legal, medical, financial) unless qualified to do so.</li>
              <li>Respect students&apos; privacy and personal information.</li>
              <li>Report any concerning behaviour to CampusLink.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Limitations</h2>
            <p className="text-muted-text leading-relaxed">
              CampusLink does not verify every statement made by mentors.
              Students are encouraged to independently assess whether a mentor
              is suitable for their needs. CampusLink does not guarantee any
              outcome from a mentorship relationship.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Fees</h2>
            <p className="text-muted-text leading-relaxed">
              Mentor registration on CampusLink is currently free. If paid
              mentoring is introduced in the future, applicable terms will be
              provided separately and will require your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">Removal</h2>
            <p className="text-muted-text leading-relaxed">
              CampusLink may suspend or remove a mentor profile if the mentor
              violates these terms, behaves inappropriately, or is inactive for
              an extended period. You may also request removal of your mentor
              profile at any time.
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/mentors/become-a-mentor"
            className="bg-primary-green text-white px-6 py-3 font-medium hover:bg-deep-green transition-colors inline-block"
          >
            Back to Application
          </Link>
        </div>
      </div>
    </div>
  );
}
