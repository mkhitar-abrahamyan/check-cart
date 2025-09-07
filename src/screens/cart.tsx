'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '../stores/cartStore';
import { getCartItems } from '../services/api';
import { CartItem } from '../types';
import { Button, Image } from '../components/ui';

const CartPage = () => {
  const { items, removeItem, getTotal, getItemCount } = useCartStore();

  // Load cart items on component mount
  useEffect(() => {
    const loadCartItems = async () => {
      const response = await getCartItems();
      // Add items to cart store
      response.data.forEach(item => {
        useCartStore.getState().addItem(item);
      });
    };
    loadCartItems();
  }, []);

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='mt-2 text-gray-600'>
            Review your items and proceed to checkout
          </p>
        </div>

        {/* Cart Items */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {itemCount === 0 ? (
            <EmptyCartState />
          ) : (
            <div className='divide-y divide-gray-200'>
              {items.map(item => (
                <CartItemCard key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {itemCount > 0 && <CartSummary total={total} itemCount={itemCount} />}
      </div>
    </div>
  );
};

const EmptyCartState = () => (
  <div className='p-8 text-center'>
    <div className='text-gray-400 mb-4'>
      <svg
        className='mx-auto h-12 w-12'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1}
          d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6'
        />
      </svg>
    </div>
    <h3 className='text-lg font-medium text-gray-900 mb-2'>
      Your cart is empty
    </h3>
    <p className='text-gray-500'>
      Add some items to get started with your order.
    </p>
  </div>
);

const CartSummary = ({
  total,
  itemCount,
}: {
  total: number;
  itemCount: number;
}) => (
  <div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
    <div className='flex justify-between items-center mb-4'>
      <span className='text-lg font-medium text-gray-900'>
        Total ({itemCount} items)
      </span>
      <span className='text-2xl font-bold text-gray-900'>
        ${total.toFixed(2)}
      </span>
    </div>
    <div className='flex gap-4'>
      <Link href='/checkout' className='flex-1'>
        <Button variant='primary' size='lg' className='w-full'>
          Proceed to Checkout
        </Button>
      </Link>
      <Button variant='outline' size='lg'>
        Continue Shopping
      </Button>
    </div>
  </div>
);

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => (
  <div className='p-6 flex items-center space-x-4'>
    {/* Product Image */}
    <div className='flex-shrink-0'>
      <Image
        src={item.imageUrl}
        alt={item.name}
        className='h-20 w-20 object-cover rounded-lg'
        fallbackSrc='/placeholder-image.svg'
      />
    </div>

    {/* Product Details */}
    <div className='flex-1 min-w-0'>
      <h3 className='text-lg font-medium text-gray-900'>{item.name}</h3>
      <p className='text-sm text-gray-500'>by {item.manufacturer}</p>
      <div className='mt-2 flex items-center space-x-4'>
        <span className='text-lg font-semibold text-gray-900'>
          ${item.price.toFixed(2)}
        </span>
      </div>
    </div>

    {/* Actions */}
    <div className='flex items-center space-x-2'>
      <button
        onClick={() => onRemove(item.id)}
        className='text-gray-400 hover:text-red-500 transition-colors'
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
      </button>
    </div>
  </div>
);

export default CartPage;
