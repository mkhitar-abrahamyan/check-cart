/** Cart Item Types */
export interface CartItem {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
}

/** Delivery Types */
export interface DeliveryOptions {
  fast: number | null;
  regular: number | null;
  slow: number | null;
}

/** City Types */
export interface City {
  id: number;
  name: string;
  delivery: DeliveryOptions;
}

/** API Response Types */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/** Checkout Types */
export interface CheckoutForm {
  cityId: number;
  deliveryType: 'fast' | 'regular' | 'slow';
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    apartment?: string;
    zipCode: string;
  };
}
