'use client';

import { BounceLoader } from 'react-spinners';

import Box from '@/components/box';

const SearchLoading = () => {
  return (
    <Box className='h-full flex justify-center items-center'>
      <BounceLoader size={40} color='#22c55e' />
    </Box>
  );
};

export default SearchLoading;
