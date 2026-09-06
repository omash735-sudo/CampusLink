// components/connect/StudentGrid.tsx
import Link from 'next/link';
import { UserIcon, AcademicIcon, BookOpenIcon } from '@/components/icons';

interface StudentCardProps {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  programme: string | null;
  year: number | null;
  interests: string[] | null;
}

export function StudentGrid({ students }: { students: StudentCardProps[] }) {
  if (students.length === 0) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-muted-text">No students found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

function StudentCard({ student }: { student: StudentCardProps }) {
  const initials = student.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      href={`/profile/${student.username}`}
      className="border border-gray-200 bg-white hover:border-primary-green transition-colors p-4 block"
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 flex-shrink-0 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-lg overflow-hidden">
          {student.avatar ? (
            <img src={student.avatar} alt={student.fullName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary-text truncate flex items-center gap-1">
            <UserIcon className="h-3 w-3 text-muted-text flex-shrink-0" />
            {student.fullName}
          </h3>
          {student.programme && (
            <p className="text-sm text-muted-text truncate flex items-center gap-1">
              <BookOpenIcon className="h-3 w-3 flex-shrink-0" />
              {student.programme}
            </p>
          )}
          {student.year && (
            <p className="text-sm text-muted-text flex items-center gap-1">
              <AcademicIcon className="h-3 w-3 flex-shrink-0" />
              Year {student.year}
            </p>
          )}
          {student.interests && student.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {student.interests.slice(0, 2).map((interest) => (
                <span key={interest} className="text-xs bg-gray-100 px-2 py-0.5">
                  {interest}
                </span>
              ))}
              {student.interests.length > 2 && (
                <span className="text-xs text-muted-text">
                  +{student.interests.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
