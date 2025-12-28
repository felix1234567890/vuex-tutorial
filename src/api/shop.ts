import type { Product, CartItem, TransactionResult } from '@/types';

/**
 * Mock product data
 */
const _products: Product[] = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2, image: "https://via.placeholder.com/200x150" },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10, image: "https://via.placeholder.com/200x150" },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5, image: "https://via.placeholder.com/200x150" },
  { id: 4, title: "Wireless Headphones", price: 99.99, inventory: 8, image: "https://via.placeholder.com/200x150" }
];

/**
 * Simulates API delay
 * @param ms - Milliseconds to delay
 * @returns Promise - Promise that resolves after delay
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Shop API service
 */
export default {
  /**
   * Get all products
   * @returns Promise - Promise that resolves with products array
   */
  async getProducts(): Promise<Product[]> {
    await delay(500); // Simulate network delay
    return [..._products]; // Return a copy to prevent mutation
  },

  /**
   * Process a purchase
   * @param items - Cart items to purchase
   * @returns Promise - Promise that resolves with transaction result
   */
  async buyProducts(items: CartItem[]): Promise<TransactionResult> {
    // We're not using items in this mock implementation, but in a real API we would
    console.log('Processing purchase for', items.length, 'items');

    await delay(500); // Simulate network delay

    // Simulate random checkout success/failure
    const success = Math.random() > 0.3 || navigator.userAgent.indexOf("PhantomJS") > -1;

    if (success) {
      // Generate a random transaction ID without using deprecated substr
      const transactionId = 'tr_' + Math.random().toString(36).slice(2, 11);
      return { success: true, transaction: { id: transactionId }};
    } else {
      throw new Error('Checkout failed. Please try again.');
    }
  }
};
