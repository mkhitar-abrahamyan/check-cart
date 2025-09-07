'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserStore } from '../stores/userStore';
import { useCartStore } from '../stores/cartStore';
import { useCheckoutStore } from '../stores/checkoutStore';
import { getCities } from '../services/api';
import { City, Order } from '../types';
import type { CheckoutForm } from '../types';
import { Input, Select, RadioSelect, Button, Image } from '../components/ui';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { items, getTotal, clearCart } = useCartStore();
  const {
    selectedCityId,
    selectedDeliveryType,
    setSelectedCity,
    setSelectedDeliveryType,
    getAvailableDeliveryTypes,
    getDeliveryPrice,
    resetCheckout,
  } = useCheckoutStore();

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCityData] = useState<City | null>(null);
  const [formData, setFormData] = useState<Partial<CheckoutForm>>({
    customerInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    address: {
      street: '',
      apartment: '',
      zipCode: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      const response = await getCities();
      setCities(response.data);
    };
    loadCities();
  }, []);

  // Update selected city data when city ID changes
  useEffect(() => {
    if (selectedCityId && cities.length > 0) {
      const city = cities.find(c => c.id === selectedCityId);
      setSelectedCityData(city || null);
    } else {
      setSelectedCityData(null);
    }
  }, [selectedCityId, cities]);

  const subtotal = useMemo(() => getTotal(), [getTotal]);
  const deliveryPrice = useMemo(
    () =>
      selectedCity && selectedDeliveryType
        ? getDeliveryPrice(selectedCity, selectedDeliveryType)
        : 0,
    [selectedCity, selectedDeliveryType, getDeliveryPrice]
  );
  const total = useMemo(
    () => subtotal + deliveryPrice,
    [subtotal, deliveryPrice]
  );

  const handleCityChange = useCallback(
    (cityId: string) => {
      const id = cityId ? parseInt(cityId) : null;
      setSelectedCity(id);
      setSelectedDeliveryType(null); // Reset delivery type when city changes
    },
    [setSelectedCity, setSelectedDeliveryType]
  );

  const handleDeliveryTypeChange = useCallback(
    (type: 'fast' | 'regular' | 'slow') => {
      setSelectedDeliveryType(type);
    },
    [setSelectedDeliveryType]
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleNestedInputChange = useCallback(
    (parent: string, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [field]: value,
        },
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedCityId || !selectedDeliveryType || !selectedCity) {
        alert('Please select a city and delivery option');
        return;
      }

      setIsSubmitting(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create order
      const order: Order = {
        id: `order_${Date.now()}`,
        items,
        customerInfo: formData.customerInfo!,
        address: formData.address!,
        cityId: selectedCityId,
        deliveryType: selectedDeliveryType,
        deliveryPrice,
        subtotal,
        total,
        createdAt: new Date(),
      };

      console.log('Order placed:', order);

      // Clear cart and reset checkout
      clearCart();
      resetCheckout();

      setIsSubmitting(false);
      setShowSuccessModal(true);
    },
    [
      selectedCityId,
      selectedDeliveryType,
      selectedCity,
      items,
      formData,
      deliveryPrice,
      subtotal,
      total,
      clearCart,
      resetCheckout,
    ]
  );

  const availableDeliveryTypes = useMemo(
    () => (selectedCity ? getAvailableDeliveryTypes(selectedCity) : []),
    [selectedCity, getAvailableDeliveryTypes]
  );

  const deliveryOptions = useMemo(
    () =>
      (['fast', 'regular', 'slow'] as const).map(type => {
        const isAvailable = availableDeliveryTypes.includes(type);
        const price = selectedCity?.delivery[type];
        const displayPrice = price !== null ? `$${price}` : 'Not available';

        return {
          value: type,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Delivery`,
          description:
            type === 'fast'
              ? '1-2 business days'
              : type === 'regular'
                ? '3-5 business days'
                : '5-7 business days',
          price: displayPrice,
          disabled: !isAvailable,
        };
      }),
    [availableDeliveryTypes, selectedCity]
  );

  const cityOptions = useMemo(
    () =>
      cities.map(city => ({
        value: city.id,
        label: city.name,
      })),
    [cities]
  );

  if (items.length === 0) {
    return <EmptyCartRedirect />;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='mt-2 text-gray-600'>
            Complete your order with delivery information
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Checkout Form */}
          <CheckoutForm
            formData={formData}
            selectedCityId={selectedCityId}
            selectedDeliveryType={selectedDeliveryType}
            selectedCity={selectedCity}
            cityOptions={cityOptions}
            deliveryOptions={deliveryOptions}
            isSubmitting={isSubmitting}
            onCityChange={handleCityChange}
            onDeliveryTypeChange={handleDeliveryTypeChange}
            onNestedInputChange={handleNestedInputChange}
            onSubmit={handleSubmit}
          />

          {/* Order Summary */}
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryPrice={deliveryPrice}
            total={total}
            selectedCity={selectedCity}
            selectedDeliveryType={selectedDeliveryType}
          />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

const EmptyCartRedirect = () => (
  <div className='min-h-screen bg-gray-50 py-8'>
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Your cart is empty
        </h1>
        <p className='text-gray-600 mb-6'>
          Add some items to your cart before checking out.
        </p>
        <Link href='/cart'>
          <Button variant='primary' size='md'>
            Go to Cart
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

interface CheckoutFormProps {
  formData: Partial<CheckoutForm>;
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
  isSubmitting: boolean;
  onCityChange: (cityId: string) => void;
  onDeliveryTypeChange: (type: 'fast' | 'regular' | 'slow') => void;
  onNestedInputChange: (parent: string, field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  selectedCityId,
  selectedDeliveryType,
  selectedCity,
  cityOptions,
  deliveryOptions,
  isSubmitting,
  onCityChange,
  onDeliveryTypeChange,
  onNestedInputChange,
  onSubmit,
}) => (
  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
    <h2 className='text-xl font-semibold text-gray-900 mb-6'>
      Delivery Information
    </h2>
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Customer Information */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          Customer Information
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
        </div>

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

        <Input
          id='phone'
          label='Phone Number'
          type='tel'
          value={formData.customerInfo?.phone || ''}
          onChange={e =>
            onNestedInputChange('customerInfo', 'phone', e.target.value)
          }
          required
        />
      </div>

      {/* Delivery Address */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>Delivery Address</h3>

        <Input
          id='street'
          label='Street Address'
          type='text'
          value={formData.address?.street || ''}
          onChange={e =>
            onNestedInputChange('address', 'street', e.target.value)
          }
          required
        />

        <Input
          id='apartment'
          label='Apartment, suite, etc. (optional)'
          type='text'
          value={formData.address?.apartment || ''}
          onChange={e =>
            onNestedInputChange('address', 'apartment', e.target.value)
          }
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Select
            id='city'
            label='City'
            value={selectedCityId || ''}
            onChange={e => onCityChange(e.target.value)}
            options={cityOptions}
            placeholder='Select a city'
            required
          />
          <Input
            id='zipCode'
            label='ZIP Code'
            type='text'
            value={formData.address?.zipCode || ''}
            onChange={e =>
              onNestedInputChange('address', 'zipCode', e.target.value)
            }
            required
          />
        </div>
      </div>

      {/* Delivery Options */}
      <div className='space-y-4'>
        {!selectedCity ? (
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Delivery Options
            </h3>
            <p className='text-gray-500 text-sm'>Please select a city first</p>
          </div>
        ) : (
          <RadioSelect
            name='deliveryType'
            label='Delivery Options'
            value={selectedDeliveryType || ''}
            onChange={value =>
              onDeliveryTypeChange(value as 'fast' | 'regular' | 'slow')
            }
            options={deliveryOptions}
          />
        )}
      </div>

      {/* Submit Button */}
      <div className='pt-6'>
        <Button
          type='submit'
          variant='primary'
          size='lg'
          loading={isSubmitting}
          disabled={!selectedCityId || !selectedDeliveryType}
          className='w-full'
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </form>
  </div>
);

interface OrderSummaryProps {
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
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  deliveryPrice,
  total,
  selectedCity,
  selectedDeliveryType,
}) => (
  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
    <h2 className='text-xl font-semibold text-gray-900 mb-6'>Order Summary</h2>

    {/* Cart Items */}
    <div className='space-y-4 mb-6'>
      {items.map(item => (
        <div key={item.id} className='flex items-center space-x-3'>
          <Image
            src={item.imageUrl}
            alt={item.name}
            className='h-12 w-12 object-cover rounded'
            fallbackSrc='/placeholder-image.svg'
          />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {item.name}
            </p>
            <p className='text-xs text-gray-500'>{item.manufacturer}</p>
          </div>
          <p className='text-sm font-medium text-gray-900'>
            ${item.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>

    {/* Totals */}
    <div className='border-t border-gray-200 pt-4 space-y-2'>
      <div className='flex justify-between text-sm'>
        <span className='text-gray-600'>Subtotal</span>
        <span className='text-gray-900'>${subtotal.toFixed(2)}</span>
      </div>
      {selectedCity && selectedDeliveryType && (
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>
            {selectedDeliveryType.charAt(0).toUpperCase() +
              selectedDeliveryType.slice(1)}{' '}
            delivery to {selectedCity.name}
          </span>
          <span className='text-gray-900'>${deliveryPrice.toFixed(2)}</span>
        </div>
      )}
      <div className='flex justify-between text-lg font-semibold border-t border-gray-200 pt-2'>
        <span className='text-gray-900'>Total</span>
        <span className='text-gray-900'>${total.toFixed(2)}</span>
      </div>
    </div>

    {/* Back to Cart */}
    <div className='mt-6'>
      <Link
        href='/cart'
        className='text-blue-600 hover:text-blue-700 font-medium text-sm'
      >
        ← Back to Cart
      </Link>
    </div>
  </div>
);

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
    <div className='bg-white rounded-lg p-8 max-w-md mx-4 text-center'>
      <div className='text-green-600 mb-4'>
        <svg
          className='mx-auto h-12 w-12'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>Success!</h2>
      <p className='text-gray-600 mb-6'>
        Your order has been placed successfully.
      </p>
      <Button onClick={onClose} variant='secondary' size='md'>
        Back to Cart
      </Button>
    </div>
  </div>
);

export default CheckoutPage;
