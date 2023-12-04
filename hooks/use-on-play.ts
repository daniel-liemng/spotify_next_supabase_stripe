import { Song } from '@/types';
import { usePlayer } from './use-player';
import { useAuthModal } from './use-auth-modal';
import { useUser } from './use-user';
import { useSubscribeModal } from './use-subscribe-modal';

export const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();

  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();

  const { user, subscription } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id)); // play the playlist of selected category
  };

  return onPlay;
};
