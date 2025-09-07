import { CartIcon } from '../assets';

export const EmptyCartState = () => (
  <div className='p-8 text-center'>
    <div className='text-gray-400 mb-4'>
      <CartIcon />
    </div>
    <h3 className='text-lg font-medium text-gray-900 mb-2'>
      Your cart is empty
    </h3>
    <p className='text-gray-500'>
      Add some items to get started with your order.
    </p>
  </div>
);
