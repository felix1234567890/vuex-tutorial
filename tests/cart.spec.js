/* eslint-env jest */

import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../src/stores/cart'
import { useProductsStore } from '../src/stores/products'

// Mock the shop API
jest.mock('../src/api/shop.ts', () => ({
  default: {
    buyProductsCallback: jest.fn()
  }
}))

// Mock the products store
jest.mock('../src/stores/products', () => ({
  useProductsStore: jest.fn()
}))

describe('Cart Store', () => {
  let cartStore
  let productsStore
  let mockShop

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    
    // Mock products store
    productsStore = {
      items: [
        { id: 1, title: 'iPad 4 Mini', price: 500.01, inventory: 2 },
        { id: 2, title: 'H&M T-Shirt White', price: 10.99, inventory: 10 },
        { id: 3, title: 'Charli XCX - Sucker CD', price: 19.99, inventory: 5 }
      ],
      productIsInStock: jest.fn(),
      decrementInventory: jest.fn()
    }
    
    useProductsStore.mockReturnValue(productsStore)
    
    // Mock shop API
    mockShop = require('../src/api/shop.ts').default
    
    // Create cart store instance
    cartStore = useCartStore()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('State', () => {
    it('should have initial state', () => {
      expect(cartStore.items).toEqual([])
      expect(cartStore.checkoutStatus).toBeNull()
    })
  })

  describe('Getters', () => {
    describe('cartProducts', () => {
      it('should return empty array when cart is empty', () => {
        expect(cartStore.cartProducts).toEqual([])
      })

      it('should return cart products with product details', () => {
        cartStore.items = [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
        
        const result = cartStore.cartProducts
        
        expect(result).toEqual([
          {
            id: 1,
            title: 'iPad 4 Mini',
            price: 500.01,
            quantity: 2
          },
          {
            id: 2,
            title: 'H&M T-Shirt White',
            price: 10.99,
            quantity: 1
          }
        ])
      })

      it('should filter out products not found in products store', () => {
        cartStore.items = [
          { id: 1, quantity: 1 },
          { id: 999, quantity: 1 } // Non-existent product
        ]
        
        const result = cartStore.cartProducts
        
        expect(result).toEqual([
          {
            id: 1,
            title: 'iPad 4 Mini',
            price: 500.01,
            quantity: 1
          }
        ])
      })
    })

    describe('cartTotal', () => {
      it('should return 0 when cart is empty', () => {
        expect(cartStore.cartTotal).toBe(0)
      })

      it('should calculate total price correctly', () => {
        cartStore.items = [
          { id: 1, quantity: 2 }, // 500.01 * 2 = 1000.02
          { id: 2, quantity: 1 }  // 10.99 * 1 = 10.99
        ]
        
        expect(cartStore.cartTotal).toBe(1011.01)
      })

      it('should ignore products not found in products store', () => {
        cartStore.items = [
          { id: 1, quantity: 1 }, // 500.01 * 1 = 500.01
          { id: 999, quantity: 1 } // Non-existent product
        ]
        
        expect(cartStore.cartTotal).toBe(500.01)
      })
    })

    describe('cartItemCount', () => {
      it('should return 0 when cart is empty', () => {
        expect(cartStore.cartItemCount).toBe(0)
      })

      it('should return total quantity of all items', () => {
        cartStore.items = [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
          { id: 3, quantity: 1 }
        ]
        
        expect(cartStore.cartItemCount).toBe(6)
      })
    })
  })

  describe('Actions', () => {
    describe('addProductToCart', () => {
      it('should add new product to cart when product is in stock', () => {
        const product = { id: 1, title: 'iPad 4 Mini', inventory: 2 }
        productsStore.productIsInStock.mockReturnValue(true)
        
        cartStore.addProductToCart(product)
        
        expect(cartStore.items).toEqual([{ id: 1, quantity: 1 }])
        expect(productsStore.decrementInventory).toHaveBeenCalledWith(product)
      })

      it('should increment quantity when product already exists in cart', () => {
        const product = { id: 1, title: 'iPad 4 Mini', inventory: 2 }
        productsStore.productIsInStock.mockReturnValue(true)
        cartStore.items = [{ id: 1, quantity: 1 }]
        
        cartStore.addProductToCart(product)
        
        expect(cartStore.items).toEqual([{ id: 1, quantity: 2 }])
        expect(productsStore.decrementInventory).toHaveBeenCalledWith(product)
      })

      it('should not add product when product is not in stock', () => {
        const product = { id: 1, title: 'iPad 4 Mini', inventory: 0 }
        productsStore.productIsInStock.mockReturnValue(false)
        
        cartStore.addProductToCart(product)
        
        expect(cartStore.items).toEqual([])
        expect(productsStore.decrementInventory).not.toHaveBeenCalled()
      })
    })

    describe('checkout', () => {
      it('should process checkout successfully', () => {
        cartStore.items = [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
        
        // Mock the callback-based API
        mockShop.buyProductsCallback.mockImplementation((items, successCallback, _errorCallback) => {
          // Simulate successful checkout
          successCallback()
        })
        
        cartStore.checkout()
        
        expect(cartStore.checkoutStatus).toBe('success')
        expect(cartStore.items).toEqual([])
      })

      it('should handle checkout failure', () => {
        cartStore.items = [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
        
        // Mock the callback-based API
        mockShop.buyProductsCallback.mockImplementation((items, successCallback, errorCallback) => {
          // Simulate failed checkout
          errorCallback()
        })
        
        cartStore.checkout()
        
        expect(cartStore.checkoutStatus).toBe('failed')
        expect(cartStore.items).toEqual([
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ])
      })

      it('should set processing status during checkout', () => {
        cartStore.items = [{ id: 1, quantity: 1 }]
        
        // Mock the callback-based API with delayed execution
        mockShop.buyProductsCallback.mockImplementation((items, successCallback, _errorCallback) => {
          // Don't call callbacks immediately to test processing state
          setTimeout(() => successCallback(), 10)
        })
        
        cartStore.checkout()
        
        expect(cartStore.checkoutStatus).toBe('processing')
      })
    })

    describe('setCheckoutStatus', () => {
      it('should set checkout status', () => {
        cartStore.setCheckoutStatus('success')
        expect(cartStore.checkoutStatus).toBe('success')
        
        cartStore.setCheckoutStatus('failed')
        expect(cartStore.checkoutStatus).toBe('failed')
      })
    })

    describe('setCartItems', () => {
      it('should set cart items', () => {
        const items = [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 }
        ]
        
        cartStore.setCartItems(items)
        expect(cartStore.items).toEqual(items)
      })

      it('should replace existing items', () => {
        cartStore.items = [{ id: 1, quantity: 1 }]
        
        const newItems = [{ id: 2, quantity: 3 }]
        cartStore.setCartItems(newItems)
        
        expect(cartStore.items).toEqual(newItems)
      })
    })
  })

  describe('Integration', () => {
    it('should maintain cart state consistency across actions', () => {
      const product = { id: 1, title: 'iPad 4 Mini', inventory: 2 }
      productsStore.productIsInStock.mockReturnValue(true)
      
      // Add product
      cartStore.addProductToCart(product)
      expect(cartStore.cartItemCount).toBe(1)
      expect(cartStore.cartTotal).toBe(500.01)
      
      // Add same product again
      cartStore.addProductToCart(product)
      expect(cartStore.cartItemCount).toBe(2)
      expect(cartStore.cartTotal).toBe(1000.02)
      
      // Clear cart
      cartStore.setCartItems([])
      expect(cartStore.cartItemCount).toBe(0)
      expect(cartStore.cartTotal).toBe(0)
    })
  })
})
