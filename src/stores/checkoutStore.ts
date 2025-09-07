import { create } from 'zustand';
import { City, DeliveryOptions } from '@/types';

interface CheckoutState {
  selectedCityId: number | null;
  selectedDeliveryType: keyof DeliveryOptions | null;
  deliveryPrice: number;
  setSelectedCity: (cityId: number | null) => void;
  setSelectedDeliveryType: (type: keyof DeliveryOptions | null) => void;
  getAvailableDeliveryTypes: (city: City) => (keyof DeliveryOptions)[];
  getDeliveryPrice: (city: City, type: keyof DeliveryOptions) => number;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  selectedCityId: null,
  selectedDeliveryType: null,
  deliveryPrice: 0,

  setSelectedCity: cityId => {
    set({
      selectedCityId: cityId,
      selectedDeliveryType: null,
      deliveryPrice: 0,
    });
  },

  setSelectedDeliveryType: type => {
    const { selectedCityId } = get();
    if (!selectedCityId || !type) {
      set({ selectedDeliveryType: type, deliveryPrice: 0 });
      return;
    }

    set({ selectedDeliveryType: type });
  },

  getAvailableDeliveryTypes: city => {
    const availableTypes: (keyof DeliveryOptions)[] = [];
    if (city.delivery.fast !== null) availableTypes.push('fast');
    if (city.delivery.regular !== null) availableTypes.push('regular');
    if (city.delivery.slow !== null) availableTypes.push('slow');
    return availableTypes;
  },

  getDeliveryPrice: (city, type) => {
    const price = city.delivery[type];
    return price !== null ? price : 0;
  },

  resetCheckout: () => {
    set({
      selectedCityId: null,
      selectedDeliveryType: null,
      deliveryPrice: 0,
    });
  },
}));
