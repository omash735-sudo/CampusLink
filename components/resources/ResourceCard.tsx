// components/resources/ResourceCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getFileSize } from '@/lib/utils';

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    downloads: number;
    viewCount: number;
    year: number | null;
    semester: string | null;
    academicYear: string | null;
    course: string | null;
    isVerified: boolean;
    createdAt: Date;
    programme: {
      id: string;
      name: string;
      slug: string;
    } | null;
    courseInfo: {
      id: string;
      name: string;
      slug: string;
      code: string;
    } | null;
  };
  currentUserId?: string;
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

export function ResourceCard({ resource, currentUserId, isSaved = false, onSave }: ResourceCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      window.location.href = '/auth/login';
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/resources/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id }),
      });
      if (res.ok) {
        setSaved(!saved);
        if (onSave) onSave(resource.id);
      }
    } catch (error) {
      console.error('Failed to save resource:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (fileType: string) => {
    const colors: Record<string, string> = {
      'pdf': 'bg-red-100 text-red-700',
      'doc': 'bg-blue-100 text-blue-700',
      'docx': 'bg-blue-100 text-blue-700',
      'ppt': 'bg-orange-100 text-orange-700',
      'pptx': 'bg-orange-100 text-orange-700',
      'xls': 'bg-green-100 text-green-700',
      'xlsx': 'bg-green-100 text-green-700',
      'txt': 'bg-gray-100 text-gray-700',
    };
    return colors[fileType.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="border border-gray-200 bg-white hover:border-primary-green transition-colors overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 ${getTypeColor(resource.fileType)}`}>
                {resource.fileType.toUpperCase()}
              </span>
              {resource.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Verified</span>
              )}
            </div>
            <Link href={`/resources/${resource.id}`}>
              <h3 className="font-semibold text-primary-text hover:text-primary-green transition-colors line-clamp-1">
                {resource.title}
              </h3>
            </Link>
            {resource.courseInfo && (
              <p className="text-sm text-muted-text">{resource.courseInfo.name}</p>
            )}
            {resource.programme && (
              <p className="text-sm text-muted-text">{resource.programme.name}</p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`flex-shrink-0 px-3 py-1 text-sm border ${
              saved ? 'bg-primary-green text-white border-primary-green' : 'border-gray-300 text-muted-text hover:border-primary-green'
            } transition-colors`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {resource.description && (
          <p className="text-sm text-muted-text mt-2 line-clamp-2">{resource.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-text">
          <span>{resource.fileType.toUpperCase()}</span>
          <span>{getFileSize(resource.fileSize)}</span>
          <span>Downloads: {resource.downloads}</span>
          <span>Views: {resource.viewCount}</span>
          {resource.academicYear && <span>Year: {resource.academicYear}</span>}
          <span>Added: {new Date(resource.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/resources/${resource.id}`}
            className="flex-1 text-center border border-primary-green text-primary-green px-3 py-1.5 text-sm hover:bg-primary-green hover:text-white transition-colors"
          >
            View
          </Link>
          <a
            href={resource.fileUrl}
            download
            className="flex-1 text-center bg-primary-green text-white px-3 py-1.5 text-sm hover:bg-deep-green transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
