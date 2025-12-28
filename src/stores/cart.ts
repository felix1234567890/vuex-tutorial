import * as shop from '../api/shop.ts'
import { defineStore } from 'pinia'
import { useProductsStore } from './products'
import type { Product } from './products'

interface CartItem {
  id: number;
  quantity: number;
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  checkoutStatus: string | null;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    checkoutStatus: null,
  }),

  getters: {
    cartProducts(state): CartProduct[] {
      const productsStore = useProductsStore()
      return state.items
        .map((cartItem) => {
          const product = productsStore.items.find(
            (product: Product) => product.id === cartItem.id
          )
          if (!product) return null
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: cartItem.quantity,
          }
        })
        .filter((item): item is CartProduct => item !== null)
    },

    cartTotal(state): number {
      const productsStore = useProductsStore()
      return state.items.reduce((total, cartItem) => {
        const product = productsStore.items.find(
          (product: Product) => product.id === cartItem.id
        )
        if (!product) return total
        return total + product.price * cartItem.quantity
      }, 0)
    },

    cartItemCount(state): number {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    },
  },

  actions: {
    addProductToCart(product: Product) {
      const productsStore = useProductsStore()
      if (productsStore.productIsInStock(product)) {
        const cartItem = this.items.find((item) => item.id === product.id)
        if (!cartItem) {
          this.items.push({
            id: product.id,
            quantity: 1,
          })
        } else {
          cartItem.quantity++
        }
        productsStore.decrementInventory(product)
      }
    },

    checkout() {
      const cartItems = [...this.items]
      this.checkoutStatus = 'processing'
      this.items = []

      let shopApi: any = shop as any
      for (let i = 0; i < 3; i++) {
        if (shopApi && typeof shopApi.buyProductsCallback === 'function') break
        shopApi = shopApi?.default
      }

      shopApi.buyProductsCallback(
        cartItems,
        () => {
          this.checkoutStatus = 'success'
        },
        () => {
          this.checkoutStatus = 'failed'
          this.items = cartItems
        }
      )
    },

    setCheckoutStatus(status: string) {
      this.checkoutStatus = status
    },

    setCartItems(items: CartItem[]) {
      this.items = items
    },
  },
})
