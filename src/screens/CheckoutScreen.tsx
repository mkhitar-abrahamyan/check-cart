import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  useUserStore,
  useCartStore,
  useCheckoutStore,
  useCheckoutStepsStore,
} from '@/stores';
import { getCities } from '@/services/api';
import { City } from '@/types';
import type { CheckoutForm } from '@/types';
import {
  InformationStep,
  DeliveryStep,
  SummaryStep,
  StepNavigation,
  Success,
} from '@/components/checkout';

const CheckoutScreen = () => {
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
  const { currentStep, nextStep, prevStep, resetSteps } =
    useCheckoutStepsStore();

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCityData] = useState<City | null>(null);
  const [formData, setFormData] = useState<Partial<CheckoutForm>>({
    customerInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
    },
    address: {
      street: '',
      apartment: '',
      zipCode: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      const response = await getCities();
      setCities(response.data);
    };
    loadCities();
  }, []);

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
      setSelectedDeliveryType(null);
    },
    [setSelectedCity, setSelectedDeliveryType]
  );

  const handleDeliveryTypeChange = useCallback(
    (type: 'fast' | 'regular' | 'slow') => {
      setSelectedDeliveryType(type);
    },
    [setSelectedDeliveryType]
  );

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

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedCityId || !selectedDeliveryType || !selectedCity) {
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    clearCart();
    resetCheckout();
    setIsSubmitting(false);
  }, [
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
    resetSteps,
  ]);

  const availableDeliveryTypes = useMemo(
    () => (selectedCity ? getAvailableDeliveryTypes(selectedCity) : []),
    [selectedCity, getAvailableDeliveryTypes]
  );

  const deliveryOptions = useMemo(
    () =>
      (['fast', 'regular', 'slow'] as const).map(type => {
        const isAvailable = availableDeliveryTypes.includes(type);
        const price = selectedCity?.delivery[type];
        const displayPrice = price !== null ? `$${price}` : '';

        return {
          value: type,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Delivery`,
          description: '',
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
    return <Success />;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'information':
        return (
          <InformationStep
            formData={formData}
            onNestedInputChange={handleNestedInputChange}
            onNext={nextStep}
          />
        );
      case 'delivery':
        return (
          <DeliveryStep
            selectedCityId={selectedCityId}
            selectedDeliveryType={selectedDeliveryType}
            selectedCity={selectedCity}
            cityOptions={cityOptions}
            deliveryOptions={deliveryOptions}
            onCityChange={handleCityChange}
            onDeliveryTypeChange={handleDeliveryTypeChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            items={items}
            subtotal={subtotal}
            deliveryPrice={deliveryPrice}
            total={total}
            selectedCity={selectedCity}
            selectedDeliveryType={selectedDeliveryType}
            customerInfo={formData.customerInfo!}
            onPlaceOrder={handlePlaceOrder}
            onBack={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='bg-gray-50 max-w-[560px] w-full mx-auto my-6 rounded-2xl'>
      <div className='flex flex-col'>
        <h1 className='rounded-tl-[16px] rounded-tr-[16px] font-bold text-4xl leading-[1.2] bg-[#EAEAEA] tracking-[-0.02em] text-[#000000] px-6 pt-6 pb-6'>
          Checkout
        </h1>

        <StepNavigation />

        <div className='w-full'>{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
