// components/mentors/MentorCard.tsx
import Link from 'next/link';
import { UserIcon, AcademicIcon, BookOpenIcon } from '@/components/icons';

interface MentorCardProps {
  mentor: {
    id: string;
    userId: string;
    status: string;
    expertise: string[] | null;
    subjects: string[] | null;
    introduction: string | null;
    experience: string | null;
    rating: number | null;
    reviewCount: number | null;
    availability: string | null;
    user: {
      fullName: string | null;
      username: string | null;
      programme: string | null;
      year: number | null;
      avatar: string | null;
      mentorType: string | null;
    } | null;
  };
  currentUserId?: string;
}

export function MentorCard({ mentor, currentUserId }: MentorCardProps) {
  const isOwnProfile = currentUserId === mentor.userId;

  return (
    <div className="border border-gray-200 bg-white p-6 hover:border-primary-green transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-xl overflow-hidden">
          {mentor.user?.avatar ? (
            <img src={mentor.user.avatar} alt={mentor.user.fullName || ''} className="h-full w-full object-cover" />
          ) : (
            mentor.user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{mentor.user?.fullName || 'Unknown'}</h3>
            {mentor.status === 'verified' && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 flex-shrink-0">Verified</span>
            )}
          </div>
          {mentor.user?.mentorType && (
            <p className="text-sm text-muted-text">{mentor.user.mentorType} Mentor</p>
          )}
          {mentor.user?.programme && (
            <p className="text-sm text-muted-text">{mentor.user.programme}</p>
          )}
          {mentor.user?.year && (
            <p className="text-sm text-muted-text">Year {mentor.user.year}</p>
          )}
        </div>
      </div>

      {mentor.expertise && mentor.expertise.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-text mb-1">Expertise</p>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 4).map((exp) => (
              <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">{exp}</span>
            ))}
            {mentor.expertise.length > 4 && (
              <span className="text-xs text-muted-text">+{mentor.expertise.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {mentor.introduction && (
        <p className="text-sm text-muted-text mt-2 line-clamp-2">{mentor.introduction}</p>
      )}

      <div className="mt-3 flex items-center gap-4 text-sm text-muted-text">
        {mentor.availability && (
          <span className={`text-xs px-2 py-0.5 ${
            mentor.availability === 'available' ? 'bg-green-100 text-green-700' :
            mentor.availability === 'limited' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {mentor.availability === 'available' ? 'Available' :
             mentor.availability === 'limited' ? 'Limited Availability' :
             'Unavailable'}
          </span>
        )}
        <span>{mentor.rating || 0} rating</span>
        <span>{mentor.reviewCount || 0} reviews</span>
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/mentors/${mentor.user?.username || mentor.id}`}
          className="flex-1 text-center border border-primary-green text-primary-green px-4 py-2 text-sm hover:bg-primary-green hover:text-white transition-colors"
        >
          View Profile
        </Link>
        {!isOwnProfile && currentUserId && (
          <Link
            href={`/mentors/${mentor.user?.username || mentor.id}/request`}
            className="flex-1 text-center bg-primary-green text-white px-4 py-2 text-sm hover:bg-deep-green transition-colors"
          >
            Request Mentorship
          </Link>
        )}
      </div>
    </div>
  );
}
