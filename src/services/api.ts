import { CartItem, City, ApiResponse } from '@/types';
import { cartItems } from '@/databaseSeed/cartItemData';
import { cities } from '@/databaseSeed/citiesData';

/** Mock API functions with delays */
export const getCartItems = async (): Promise<ApiResponse<CartItem[]>> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    data: cartItems,
    success: true,
    message: 'Cart items retrieved successfully',
  };
};

export const getCities = async (): Promise<ApiResponse<City[]>> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    data: cities,
    success: true,
    message: 'Cities retrieved successfully',
  };
};
