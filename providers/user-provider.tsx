'use client';

import { MyUserContextProvider } from '@/hooks/use-user';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
