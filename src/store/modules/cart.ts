import shop from "@/api/shop";
import type { CartItem, CartState, Product, CartProduct } from "@/types";

// Action context type for this module
interface CartActionContext {
  commit: (mutation: string, payload?: any, options?: { root?: boolean }) => void;
  rootGetters: any;
  state: CartState;
}

// Cart module with namespaced true for better encapsulation
const cartModule = {
  namespaced: true,

  state: (): CartState => ({
    items: [],
    checkoutStatus: null
  }),

  getters: {
    /**
     * Get cart products with details from the products module
     */
    cartProducts(state: CartState, _getters: any, rootState: any): CartProduct[] {
      return state.items.map((cartItem: CartItem) => {
        const product = rootState.products.items.find(
          (product: Product) => product.id === cartItem.id
        );

        // Return null if product not found to avoid errors
        if (!product) return null;

        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        };
      }).filter(item => item !== null) as CartProduct[]; // Filter out any null items
    },

    /**
     * Calculate the total price of all items in cart
     */
    cartTotal(_state: CartState, getters: any): number {
      return getters.cartProducts.reduce(
        (total: number, product: CartProduct) => total + product.price * product.quantity,
        0
      );
    },

    /**
     * Get the number of items in cart
     */
    cartItemCount(state: CartState): number {
      return state.items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
    }
  },

  actions: {
    /**
     * Add a product to the cart
     */
    addProductToCart({ rootGetters, state, commit }: CartActionContext, product: Product) {
      // Check if product is in stock using the products module getter
      if (rootGetters['products/productIsInStock'](product)) {
        const cartItem = state.items.find((item: CartItem) => item.id === product.id);

        if (!cartItem) {
          // Add new product to cart
          commit("addToCart", product.id);
        } else {
          // Increment quantity of existing product
          commit("incrementQuantity", cartItem);
        }

        // Update product inventory in products module
        commit("products/decrementInventory", product.id, { root: true });
      }
    },

    /**
     * Process checkout
     */
    async checkout({ state, commit }: CartActionContext) {
      const cartItems = [...state.items];

      // Set checkout status to 'processing'
      commit("setCheckoutStatus", "processing");

      // Empty the cart
      commit("setCartItems", []);

      try {
        // Call API to process the purchase
        await shop.buyProducts(cartItems);
        commit("setCheckoutStatus", "success");
        console.log('Checkout successful for items:', cartItems);
      } catch (error) {
        console.error('Checkout failed:', error);
        commit("setCheckoutStatus", "failed");
        // Restore cart items if checkout fails
        commit("setCartItems", cartItems);
      }
    }
  },

  mutations: {
    /**
     * Add a new product to the cart
     */
    addToCart(state: CartState, productId: number) {
      state.items.push({
        id: productId,
        quantity: 1
      });
    },

    /**
     * Increment the quantity of an item in the cart
     */
    incrementQuantity(_state: CartState, cartItem: CartItem) {
      cartItem.quantity++;
    },

    /**
     * Set the checkout status
     */
    setCheckoutStatus(_state: CartState, status: string) {
      _state.checkoutStatus = status;
    },

    /**
     * Set cart items (used for emptying cart or restoring items)
     */
    setCartItems(state: CartState, items: CartItem[]) {
      state.items = items;
    }
  }
};

export default cartModule;
