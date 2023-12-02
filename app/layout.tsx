import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

import Sidebar from '@/components/sidebar';
import SupabaseProvider from '@/providers/supabase-provider';
import UserProvider from '@/providers/user-provider';
import ModalProvider from '@/providers/modal-provider';
import ToastProvider from '@/providers/toast-provider';
import { getSongsByUserId } from '@/actions/get-songs-by-userid';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify | Next',
  description: 'Spotify | Next',
};

export const revalidate = 0;

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const userSongs = await getSongsByUserId();

  return (
    <html lang='en'>
      <body className={font.className}>
        <ToastProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;
