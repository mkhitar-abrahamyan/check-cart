import React from 'react';

import { CartItem } from '@/types';
import { Image } from '../ui';
import { TrashIcon } from '../assets';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: number) => void;
  className: string;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  className,
}) => (
  <div className={`py-6 flex items-center space-x-4 ${className}`}>
    <div className='flex-shrink-0'>
      <Image
        src={item.imageUrl}
        alt={item.name}
        className='h-20 w-20 object-cover rounded-lg'
        fallbackSrc='/placeholder-image.svg'
      />
    </div>

    <div className='flex-1 min-w-0'>
      <h3 className='font-semibold text-lg leading-[1.2] tracking-[-0.02em] text-[#000000]'>
        {item.name} - ${item.price.toFixed(2)}
      </h3>
      <p className='font-normal text-base leading-[1.4] tracking-normal text-[#000000]'>by {item.manufacturer}</p>
    </div>

    <button
      onClick={() => onRemove(item.id)}
      className='hover:text-red-500 flex items-center justify-center w-[47px] h-[47px] rounded-md border bg-[#E3E3E3] p-4 pt-[15px] pr-[15px]'
      aria-label={`Remove ${item.name} from cart`}
    >
      <TrashIcon />
    </button>
  </div>
);
