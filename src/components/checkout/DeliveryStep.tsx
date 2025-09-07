import React, { useState } from 'react';

import { City } from '@/types';
import { Select, RadioSelect, Button } from '../ui';

interface DeliveryStepProps {
  selectedCityId: number | null;
  selectedDeliveryType: string | null;
  selectedCity: City | null;
  cityOptions: Array<{ value: number; label: string }>;
  deliveryOptions: Array<{
    value: string;
    label: string;
    description: string;
    price: string;
    disabled: boolean;
  }>;
  onCityChange: (cityId: string) => void;
  onDeliveryTypeChange: (type: 'fast' | 'regular' | 'slow') => void;
  onNext: () => void;
  onBack: () => void;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  selectedCityId,
  selectedDeliveryType,
  selectedCity,
  cityOptions,
  deliveryOptions,
  onCityChange,
  onDeliveryTypeChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCityId) {
      newErrors.city = 'Please select a city';
    }

    if (!selectedDeliveryType) {
      newErrors.deliveryType = 'Please select a delivery type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='space-y-6'>
        <div>
          <Select
            id='city'
            label='City'
            value={selectedCityId || ''}
            onChange={e => onCityChange(e.target.value)}
            options={cityOptions}
            placeholder='Select a city'
            required
          />
          {errors.city && (
            <p className='text-red-500 text-sm mt-1'>{errors.city}</p>
          )}
        </div>

        <div>
          {!selectedCity ? (
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-3'>
                Delivery Type
              </h3>
              <p className='text-gray-500 text-sm'>
                Please select a city first
              </p>
            </div>
          ) : (
            <RadioSelect
              name='deliveryType'
              label='Delivery Type'
              value={selectedDeliveryType || ''}
              onChange={value =>
                onDeliveryTypeChange(value as 'fast' | 'regular' | 'slow')
              }
              options={deliveryOptions}
            />
          )}
          {errors.deliveryType && (
            <p className='text-red-500 text-sm mt-1'>{errors.deliveryType}</p>
          )}
        </div>
      </div>

      <div className='flex gap-4 mt-8'>
        <Button variant='secondary' onClick={onBack} className='flex-1'>
          Back to Information
        </Button>
        <Button
          variant='primary'
          onClick={handleNext}
          className='flex-1'
          disabled={!selectedCityId || !selectedDeliveryType}
        >
          To Summary
        </Button>
      </div>
    </div>
  );
};
