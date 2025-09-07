import React, { useState } from 'react';
import Link from 'next/link';

import { Input, Button } from '../ui';
import { validateCheckoutForm } from '@/utils';
import type { CheckoutForm } from '@/types';

interface InformationStepProps {
  formData: Partial<CheckoutForm>;
  onNestedInputChange: (parent: string, field: string, value: string) => void;
  onNext: () => void;
}

export const InformationStep: React.FC<InformationStepProps> = ({
  formData,
  onNestedInputChange,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    if (!formData.customerInfo) {
      setErrors({ general: 'Customer information is required' });
      return false;
    }

    const validation = validateCheckoutForm({
      customerInfo: {
        firstName: formData.customerInfo.firstName || '',
        lastName: formData.customerInfo.lastName || '',
        email: formData.customerInfo.email || '',
      },
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='space-y-4'>
        <div>
          <Input
            id='firstName'
            label='First Name'
            type='text'
            value={formData.customerInfo?.firstName || ''}
            onChange={e =>
              onNestedInputChange('customerInfo', 'firstName', e.target.value)
            }
            required
          />
          {errors.firstName && (
            <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>
          )}
        </div>

        <div>
          <Input
            id='lastName'
            label='Last Name'
            type='text'
            value={formData.customerInfo?.lastName || ''}
            onChange={e =>
              onNestedInputChange('customerInfo', 'lastName', e.target.value)
            }
            required
          />
          {errors.lastName && (
            <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>
          )}
        </div>

        <div>
          <Input
            id='email'
            label='Email Address'
            type='email'
            value={formData.customerInfo?.email || ''}
            onChange={e =>
              onNestedInputChange('customerInfo', 'email', e.target.value)
            }
            required
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4 mt-6'>
        <Button variant='primary' onClick={handleNext}>
          To Delivery Step
        </Button>
        <Link href='/cart'>
          <Button variant='secondary' className='w-full'>
            Back to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
};
