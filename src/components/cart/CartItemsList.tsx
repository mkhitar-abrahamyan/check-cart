import React from 'react';
import { CartItem } from '@/types';
import { CartItemCard } from './CartItemCard';

interface CartItemsListProps {
  items: CartItem[];
  onRemove: (id: number) => void;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({
  items,
  onRemove,
}) => (
  <div>
    {items.map((item, index) => (
      <CartItemCard
        key={item.id}
        item={item}
        onRemove={onRemove}
        className={index < items.length - 1 ? 'border-b border-gray-200' : ''}
      />
    ))}
  </div>
);
