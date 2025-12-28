/* eslint-env jest */

/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import ProductCard from '../src/components/products/ProductCard.vue'

// Mock the currency formatter
const mockCurrency = jest.fn((value) => `$${value.toFixed(2)}`)

describe('ProductCard Component', () => {
  let wrapper
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    inventory: 5,
    image: 'https://example.com/product.jpg'
  }

  const createWrapper = (props = {}, options = {}) => {
    return mount(ProductCard, {
      props: {
        product: mockProduct,
        canAdd: false,
        ...props
      },
      global: {
        mocks: {
          $currency: mockCurrency
        },
        ...options.global
      }
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render product card with all elements', () => {
      wrapper = createWrapper()
      
      expect(wrapper.find('.product-card').exists()).toBe(true)
      expect(wrapper.find('.product-image').exists()).toBe(true)
      expect(wrapper.find('.product-details').exists()).toBe(true)
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('.product-price').exists()).toBe(true)
      expect(wrapper.find('.product-inventory').exists()).toBe(true)
      expect(wrapper.find('.add-to-cart-button').exists()).toBe(true)
    })

    it('should display product title', () => {
      wrapper = createWrapper()
      
      const title = wrapper.find('h3')
      expect(title.text()).toBe('Test Product')
    })

    it('should display product image with correct src and alt', () => {
      wrapper = createWrapper()
      
      const img = wrapper.find('img')
      expect(img.attributes('src')).toBe('https://example.com/product.jpg')
      expect(img.attributes('alt')).toBe('Test Product')
    })

    it('should display placeholder image when product has no image', () => {
      const productWithoutImage = { ...mockProduct, image: null }
      wrapper = createWrapper({ product: productWithoutImage })
      
      const img = wrapper.find('img')
      expect(img.attributes('src')).toBe('https://via.placeholder.com/200x150')
    })

    it('should display formatted price using $currency', () => {
      wrapper = createWrapper()
      
      const price = wrapper.find('.product-price')
      expect(mockCurrency).toHaveBeenCalledWith(29.99)
      expect(price.text()).toBe('$29.99')
    })

    it('should display inventory count', () => {
      wrapper = createWrapper()
      
      const inventory = wrapper.find('.product-inventory')
      expect(inventory.text()).toBe('In stock: 5')
    })

    it('should display correct inventory for different values', () => {
      const productWithLowStock = { ...mockProduct, inventory: 1 }
      wrapper = createWrapper({ product: productWithLowStock })
      
      const inventory = wrapper.find('.product-inventory')
      expect(inventory.text()).toBe('In stock: 1')
    })
  })

  describe('Props', () => {
    it('should accept product prop as required', () => {
      wrapper = createWrapper()
      
      expect(wrapper.props('product')).toEqual(mockProduct)
    })

    it('should accept canAdd prop with default value false', () => {
      wrapper = createWrapper()
      
      expect(wrapper.props('canAdd')).toBe(false)
    })

    it('should accept canAdd prop as true', () => {
      wrapper = createWrapper({ canAdd: true })
      
      expect(wrapper.props('canAdd')).toBe(true)
    })

    it('should handle different product data', () => {
      const differentProduct = {
        id: 2,
        title: 'Another Product',
        price: 99.99,
        inventory: 10,
        image: 'https://example.com/another.jpg'
      }
      wrapper = createWrapper({ product: differentProduct })
      
      expect(wrapper.find('h3').text()).toBe('Another Product')
      expect(wrapper.find('.product-inventory').text()).toBe('In stock: 10')
    })
  })

  describe('Add to Cart Button', () => {
    it('should render button with correct text', () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('.add-to-cart-button')
      expect(button.text()).toBe('Add to cart')
    })

    it('should be disabled when canAdd is false', () => {
      wrapper = createWrapper({ canAdd: false })
      
      const button = wrapper.find('.add-to-cart-button')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should be enabled when canAdd is true', () => {
      wrapper = createWrapper({ canAdd: true })
      
      const button = wrapper.find('.add-to-cart-button')
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('should emit add event when clicked and enabled', async () => {
      wrapper = createWrapper({ canAdd: true })
      
      const button = wrapper.find('.add-to-cart-button')
      await button.trigger('click')
      
      expect(wrapper.emitted('add')).toBeTruthy()
      expect(wrapper.emitted('add')).toHaveLength(1)
    })

    it('should not emit add event when clicked and disabled', async () => {
      wrapper = createWrapper({ canAdd: false })
      
      const button = wrapper.find('.add-to-cart-button')
      await button.trigger('click')
      
      expect(wrapper.emitted('add')).toBeFalsy()
    })

    it('should emit multiple add events on multiple clicks', async () => {
      wrapper = createWrapper({ canAdd: true })
      
      const button = wrapper.find('.add-to-cart-button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      
      expect(wrapper.emitted('add')).toHaveLength(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle product with zero inventory', () => {
      const outOfStockProduct = { ...mockProduct, inventory: 0 }
      wrapper = createWrapper({ product: outOfStockProduct })
      
      const inventory = wrapper.find('.product-inventory')
      expect(inventory.text()).toBe('In stock: 0')
    })

    it('should handle product with very long title', () => {
      const longTitleProduct = {
        ...mockProduct,
        title: 'This is a very long product title that should be truncated or handled properly by the component'
      }
      wrapper = createWrapper({ product: longTitleProduct })
      
      const title = wrapper.find('h3')
      expect(title.text()).toBe(longTitleProduct.title)
    })

    it('should handle product with zero price', () => {
      const freeProduct = { ...mockProduct, price: 0 }
      wrapper = createWrapper({ product: freeProduct })
      
      expect(mockCurrency).toHaveBeenCalledWith(0)
    })

    it('should handle product with high price', () => {
      const expensiveProduct = { ...mockProduct, price: 9999.99 }
      wrapper = createWrapper({ product: expensiveProduct })
      
      expect(mockCurrency).toHaveBeenCalledWith(9999.99)
    })

    it('should handle product with decimal inventory (edge case)', () => {
      const decimalInventoryProduct = { ...mockProduct, inventory: 5.5 }
      wrapper = createWrapper({ product: decimalInventoryProduct })
      
      const inventory = wrapper.find('.product-inventory')
      expect(inventory.text()).toBe('In stock: 5.5')
    })
  })

  describe('Component Structure', () => {
    it('should have correct CSS classes', () => {
      wrapper = createWrapper()
      
      expect(wrapper.find('.product-card').exists()).toBe(true)
      expect(wrapper.find('.product-image').exists()).toBe(true)
      expect(wrapper.find('.product-details').exists()).toBe(true)
      expect(wrapper.find('.product-price').exists()).toBe(true)
      expect(wrapper.find('.product-inventory').exists()).toBe(true)
      expect(wrapper.find('.add-to-cart-button').exists()).toBe(true)
    })

    it('should maintain proper DOM hierarchy', () => {
      wrapper = createWrapper()
      
      const card = wrapper.find('.product-card')
      expect(card.find('.product-image').exists()).toBe(true)
      expect(card.find('.product-details').exists()).toBe(true)
      
      const details = wrapper.find('.product-details')
      expect(details.find('h3').exists()).toBe(true)
      expect(details.find('.product-price').exists()).toBe(true)
      expect(details.find('.product-inventory').exists()).toBe(true)
      expect(details.find('.add-to-cart-button').exists()).toBe(true)
    })
  })

  describe('Integration', () => {
    it('should update when product prop changes', async () => {
      wrapper = createWrapper()
      
      expect(wrapper.find('h3').text()).toBe('Test Product')
      
      const newProduct = {
        id: 2,
        title: 'Updated Product',
        price: 49.99,
        inventory: 3,
        image: 'https://example.com/updated.jpg'
      }
      
      await wrapper.setProps({ product: newProduct })
      
      expect(wrapper.find('h3').text()).toBe('Updated Product')
      expect(wrapper.find('.product-inventory').text()).toBe('In stock: 3')
    })

    it('should update button state when canAdd prop changes', async () => {
      wrapper = createWrapper({ canAdd: false })
      
      let button = wrapper.find('.add-to-cart-button')
      expect(button.attributes('disabled')).toBeDefined()
      
      await wrapper.setProps({ canAdd: true })
      
      button = wrapper.find('.add-to-cart-button')
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('should handle complete product lifecycle', async () => {
      // Initial render
      wrapper = createWrapper({ canAdd: true })
      expect(wrapper.find('h3').text()).toBe('Test Product')
      
      // Click to add
      const button = wrapper.find('.add-to-cart-button')
      await button.trigger('click')
      expect(wrapper.emitted('add')).toHaveLength(1)
      
      // Update inventory
      await wrapper.setProps({
        product: { ...mockProduct, inventory: 4 }
      })
      expect(wrapper.find('.product-inventory').text()).toBe('In stock: 4')
      
      // Disable adding
      await wrapper.setProps({ canAdd: false })
      expect(wrapper.find('.add-to-cart-button').attributes('disabled')).toBeDefined()
    })
  })
})