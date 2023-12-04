'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { useUser } from '@/hooks/use-user';
import { formatPrice } from '@/lib/formatPrice';
import { postData } from '@/lib/helpers';
import { getStripe } from '@/lib/stripeClient';
import { Price, ProductWithPrice } from '@/types';
import Modal from '../modal';
import Button from '../button';
import { useSubscribeModal } from '@/hooks/use-subscribe-modal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal = ({ products }: SubscribeModalProps) => {
  const subscribeModal = useSubscribeModal();

  const { user, subscription, isLoading } = useUser();

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast.error('Already subscribed');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();

      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  let content = <div className='text-center'>No products available</div>;

  if (products.length) {
    content = (
      <div className=''>
        {products.map((product) => {
          if (!product.prices?.length) {
            return (
              <div className='d' key={product.id}>
                No prices available
              </div>
            );
          }

          return product.prices.map((price) => (
            <Button
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              key={price.id}
              className='mb-4'
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className='text-center'>Already subscribe!</div>;
  }
  return (
    <Modal
      title='Only for Premium users'
      description='Listen to music with Spotify Premium'
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
