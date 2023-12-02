'use client';

import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import uniqid from 'uniqid';

import { useUploadModal } from '@/hooks/use-upload-modal';
import Modal from '../modal';
import Input from '../input';
import Button from '../button';
import { useUser } from '@/hooks/use-user';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const uploadModal = useUploadModal();

  const { user } = useUser();

  const router = useRouter();

  const supabaseClient = useSupabaseClient();

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // reset the form
      reset();

      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    console.log(values);
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const uniqueId = uniqid();

      // upload song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(
          `song-${values.title.split(' ').join('-').toLowerCase()}-${uniqueId}`,
          songFile,
          {
            cacheControl: '3600',
            upsert: false,
          }
        );

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      // upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(
            `image-${values.title
              .split(' ')
              .join('-')
              .toLowerCase()}-${uniqueId}`,
            imageFile,
            {
              cacheControl: '3600',
              upsert: false,
            }
          );

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      console.log('AAA', songData);
      console.log('BBB', imageData);

      // save song
      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          title: values.title,
          song_path: songData.path,
          image_path: imageData.path,
          author: values.author,
          user_id: user.id,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message || 'Failed to save song');
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song created');
      reset();
      uploadModal.onClose();
    } catch (err: any) {
      console.log(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title='Add a song'
      description='Upload an mp3 file'
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <Input
          id='title'
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder='Song title'
        />

        <Input
          id='author'
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder='Song author'
        />

        <div>
          <div className='mb-1'>Select a song file</div>
          <Input
            id='song'
            disabled={isLoading}
            type='file'
            accept='.mp3'
            {...register('song', { required: true })}
          />
        </div>

        <div>
          <div className='mb-1'>Select an image</div>
          <Input
            id='image'
            disabled={isLoading}
            type='file'
            accept='image/*'
            {...register('image', { required: true })}
          />
        </div>

        <Button type='submit' disabled={isLoading}>
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
