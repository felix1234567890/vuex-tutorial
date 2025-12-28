<template>
  <div class="shopping-cart">
    <h2>Shopping Cart</h2>

    <!-- Empty cart state -->
    <div
      v-if="!cartProducts.length"
      class="empty-cart"
    >
      <p>Your cart is empty</p>
      <p class="empty-cart-message">
        Add some products to your cart to see them here.
      </p>
    </div>

    <!-- Cart items -->
    <div
      v-else
      class="cart-container"
    >
      <div class="cart-header">
        <span class="header-product">Product</span>
        <span class="header-price">Price</span>
        <span class="header-quantity">Quantity</span>
        <span class="header-total">Total</span>
      </div>

      <div class="cart-items">
        <div
          v-for="product in cartProducts"
          :key="product.id"
          class="cart-item"
        >
          <div class="item-product">
            {{ product.title }}
          </div>
          <div class="item-price">
            {{ currency(product.price) }}
          </div>
          <div class="item-quantity">
            {{ product.quantity }}
          </div>
          <div class="item-total">
            {{ currency(product.price * product.quantity) }}
          </div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount">{{ currency(cartTotal) }}</span>
        </div>

        <div class="checkout-section">
          <button
            class="checkout-button"
            :disabled="checkoutStatus === 'processing'"
            @click="processCheckout"
          >
            {{ checkoutStatus === 'processing' ? 'Processing...' : 'Checkout' }}
          </button>

          <div
            v-if="checkoutStatus"
            class="checkout-status"
            :class="statusClass"
          >
            {{ statusMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useCurrency } from '@/composables/useCurrency';

const store = useStore();
const { currency } = useCurrency();

// Computed properties
const cartProducts = computed(() =>
  store.getters['cart/cartProducts']
);

const cartTotal = computed(() =>
  store.getters['cart/cartTotal']
);

const checkoutStatus = computed(() =>
  store.state.cart.checkoutStatus
);

const statusMessage = computed(() => {
  switch(checkoutStatus.value) {
    case 'success':
      return 'Checkout successful! Thank you for your purchase.';
    case 'failed':
      return 'Checkout failed. Please try again.';
    case 'processing':
      return 'Processing your order...';
    default:
      return '';
  }
});

const statusClass = computed(() => {
  return {
    'status-success': checkoutStatus.value === 'success',
    'status-error': checkoutStatus.value === 'failed',
    'status-processing': checkoutStatus.value === 'processing'
  };
});

// Methods
const processCheckout = () => {
  store.dispatch('cart/checkout');
};
</script>

<style scoped>
.shopping-cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.empty-cart p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.empty-cart-message {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.cart-container {
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  color: #333;
}

.cart-items {
  margin: 10px 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}

.item-product {
  font-weight: 500;
}

.item-price, .item-quantity, .item-total {
  text-align: center;
}

.cart-footer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cart-total {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.total-amount {
  font-weight: bold;
  margin-left: 10px;
  color: #2c3e50;
}

.checkout-button {
  padding: 10px 25px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.checkout-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.checkout-status {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-error {
  background-color: #f8d7da;
  color: #721c24;
}

.status-processing {
  background-color: #fff3cd;
  color: #856404;
}

@media (max-width: 600px) {
  .cart-header, .cart-item {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .header-total, .item-total {
    display: none;
  }
}
</style>
