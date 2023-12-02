'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';

import { useAuthModal } from '@/hooks/use-auth-modal';
import { useUser } from '@/hooks/use-user';
import { useUploadModal } from '@/hooks/use-upload-modal';

const Library = () => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const { user } = useUser();

  // handle upload
  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    // check for Subscription

    return uploadModal.onOpen();
  };
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between px-5 py-4'>
        <div className='inline-flex items-center gap-x-2'>
          <TbPlaylist size={26} className='text-neutral-400' />
          <p className='text-neutral-400 font-medium text-base'>Your library</p>
        </div>

        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className='text-neutral-400 cursor-pointer transition hover:text-white'
        />
      </div>

      <div className='flex flex-col gap-y-2 mt-4 px-3'>List of Songs</div>
    </div>
  );
};

export default Library;
