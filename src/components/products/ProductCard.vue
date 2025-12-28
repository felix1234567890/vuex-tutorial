<template>
  <div class="product-card">
    <div class="product-image">
      <img
        :src="props.product.image || 'https://via.placeholder.com/200x150'"
        :alt="props.product.title"
      >
    </div>
    <div class="product-details">
      <h3>{{ props.product.title }}</h3>
      <p class="product-price">
        {{ currency(props.product.price) }}
      </p>
      <p class="product-inventory">
        In stock: {{ props.product.inventory }}
      </p>
      <button
        class="add-to-cart-button"
        :disabled="!props.canAdd"
        @click="emit('add')"
      >
        {{ props.canAdd ? 'Add to cart' : 'Out of Stock' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types';
import { useCurrency } from '@/composables/useCurrency';

interface Props {
  product: Product;
  canAdd: boolean;
}

const props = defineProps<Props>();
const { currency } = useCurrency();

const emit = defineEmits(['add']);
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.05);
}

.product-details {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-details h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: #2c3e50;
  height: 2.4em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-weight: bold;
  color: #42b983;
  margin: 5px 0;
  font-size: 1.2rem;
}

.product-inventory {
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0 15px;
  display: flex;
  align-items: center;
}

.product-inventory::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #42b983;
  margin-right: 6px;
}

.add-to-cart-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  margin-top: auto;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-to-cart-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.add-to-cart-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
