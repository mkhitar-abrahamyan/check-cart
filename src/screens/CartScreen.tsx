import Link from 'next/link';
import { useEffect } from 'react';

import { useCartStore } from '@/stores';
import { getCartItems } from '@/services/api';
import { CartItemsList, EmptyCartState } from '@/components/cart';
import { Button } from '@/components/ui';

const CartScreen = () => {
  const { items, removeItem, getItemCount } = useCartStore();

  useEffect(() => {
    const loadCartItems = async () => {
      const response = await getCartItems();
      response.data.forEach(item => {
        useCartStore.getState().addItem(item);
      });
    };
    loadCartItems();
  }, []);

  const itemCount = getItemCount();

  return (
    <div className='bg-gray-50 max-w-[560px] w-full mx-auto mt-6 rounded-2xl'>
      <div className='flex flex-col'>
        <h1 className='rounded-tl-[16px] rounded-tr-[16px] font-bold text-4xl leading-[1.2] bg-[#EAEAEA] tracking-[-0.02em] text-[#000000] px-6 pt-6 pb-6'>Cart</h1>

        <div className='bg-white overflow-hidden px-6'>
          {itemCount === 0 ? (
            <EmptyCartState />
          ) : (
            <CartItemsList items={items} onRemove={removeItem} />
          )}
        </div>

        {itemCount > 0 && (
          <Link href='/checkout' className='flex-1 px-6 pb-6'>
            <Button variant='primary' className='w-full'>
              Go to checkout
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
