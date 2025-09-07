import Link from 'next/link';

import { Button } from '../ui';
import React from 'react';

export const Success = () => (
  <div className='bg-gray-50 max-w-[560px] w-full mx-auto mt-6 rounded-2xl p-6 w-full flex flex-col items-center justify-center'>
    <h1 className='rounded-tl-[16px] rounded-tr-[16px] font-bold text-4xl leading-[1.2] tracking-[-0.02em] mb-[50px] text-[#000000]'>
      Success!
    </h1>

    <Link href='/cart' className='w-full'>
      <Button variant='primary' className="w-full">Back to Cart</Button>
    </Link>
  </div>
);
