'use client';

import AuthModal from '@/components/modals/auth-modal';
import SubscribeModal from '@/components/modals/subscribe-modal';
import UploadModal from '@/components/modals/upload-modal';
import { ProductWithPrice } from '@/types';
import { useEffect, useState } from 'react';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider = ({ products }: ModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
