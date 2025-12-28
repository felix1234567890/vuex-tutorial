<template>
  <header class="app-header">
    <h1>Vue Shop</h1>
    <div
      v-if="cartItemCount > 0"
      class="cart-indicator"
    >
      {{ cartItemCount }} {{ cartItemCount === 1 ? 'item' : 'items' }} in cart
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const cartItemCount = computed(() =>
  store.getters['cart/cartItemCount']
);
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.app-header h1 {
  color: #42b983;
  font-weight: 700;
}

.cart-indicator {
  background-color: #42b983;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    text-align: center;
  }

  .cart-indicator {
    margin-top: 10px;
  }
}
</style>