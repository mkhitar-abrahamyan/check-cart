import React, { useState } from 'react';

import { City } from '@/types';
import { Button, Image } from '../ui';

interface SummaryStepProps {
  items: Array<{
    id: number;
    name: string;
    manufacturer: string;
    price: number;
    imageUrl: string;
  }>;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  selectedCity: City | null;
  selectedDeliveryType: string | null;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onPlaceOrder: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  items,
  subtotal,
  deliveryPrice,
  total,
  selectedCity,
  selectedDeliveryType,
  customerInfo,
  onPlaceOrder,
  onBack,
  isSubmitting,
}) => {
  const [approveInfo, setApproveInfo] = useState(false);

  const handlePlaceOrder = () => {
    if (approveInfo) {
      onPlaceOrder();
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='space-y-6'>
        <div className='pb-6 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Products</h3>
          <div className='space-y-3'>
            {items.map(item => (
              <div key={item.id} className='flex items-center space-x-3'>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className='h-12 w-12 object-cover rounded'
                  fallbackSrc='/placeholder-image.svg'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-black truncate'>
                    {item.name}
                  </p>
                  <p className='text-xs text-black'>
                    By: {item.manufacturer}
                  </p>
                </div>
                <p className='text-sm font-semibold text-black'>
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-lg font-medium text-black mb-4'>
            Customer Information
          </h3>
          <div className='space-y-2 text-sm text-black'>
            <p>
              <span className='font-medium'>First name:</span>{' '}
              {customerInfo.firstName}
            </p>
            <p>
              <span className='font-medium text-black'>Last name:</span>{' '}
              {customerInfo.lastName}
            </p>
            <p>
              <span className='font-medium text-black'>Email:</span> {customerInfo.email}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2 border-b border-gray-200 pb-6'>
          <input
            type='checkbox'
            id='approveInfo'
            checked={approveInfo}
            onChange={e => setApproveInfo(e.target.checked)}
            className='h-4 w-4 text-black bg-[#000000] rounded'
          />
          <label htmlFor='approveInfo' className='text-sm text-black'>
            I approve this information is correct
          </label>
        </div>

        <div>
          <h3 className='text-lg font-medium text-black mb-4'>
            Order Details
          </h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between text-black'>
              <span>Products:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {selectedCity && selectedDeliveryType && (
              <div className='flex justify-between text-black'>
                <span>
                  {selectedDeliveryType.charAt(0).toUpperCase() +
                    selectedDeliveryType.slice(1)}{' '}
                  delivery to <span className="font-semibold">{selectedCity.name}</span>
                </span>
                <span>${deliveryPrice.toFixed(2)}</span>
              </div>
            )}
            <div className='flex justify-between font-semibold text-lg text-black pt-2'>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex gap-4 mt-8'>
        <Button variant='secondary' onClick={onBack} className='flex-1'>
          Back to Delivery
        </Button>
        <Button
          variant='primary'
          onClick={handlePlaceOrder}
          className='flex-1'
          disabled={!approveInfo}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};
