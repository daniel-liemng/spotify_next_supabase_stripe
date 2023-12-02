'use client';

import LikeButton from '@/components/like-button';
import MediaItem from '@/components/media-item';
import { useUser } from '@/hooks/use-user';
import { Song } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LikedContentProps {
  songs: Song[];
}

const LikedContent = ({ songs }: LikedContentProps) => {
  const router = useRouter();

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, router, user]);

  if (songs.length === 0) {
    return (
      <div className='flex flex-col gap-y-2 w-full px-6 text-neutral-400'>
        No liked songs
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-2 w-full p-6'>
      {songs.map((song) => (
        <div key={song.id} className='w-full flex items-center gap-x-4'>
          <div className='flex-1'>
            <MediaItem data={song} onClick={() => {}} />
          </div>

          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
