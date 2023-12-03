'use client';

import { useGetSongById } from '@/hooks/use-get-song-by-id';
import { useLoadSongUrl } from '@/hooks/use-load-song-url';
import { usePlayer } from '@/hooks/use-player';
import PlayerContent from './player-content';

const Player = () => {
  const player = usePlayer();

  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className='fixed bottom-0 bg-black w-full px-4 py-2 h-[80px]'>
      {/* key: to destroy the element and re-render new element. For skipping to the next song -> reset the hook */}
      <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
    </div>
  );
};

export default Player;
