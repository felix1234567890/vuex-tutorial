<template>
  <div class="product-list">
    <div class="product-list-header">
      <h2>Product List</h2>
      <p class="product-count" v-if="!loading && availableProducts.length > 0">
        {{ availableProducts.length }} products available
      </p>
    </div>

    <!-- Loading indicator -->
    <LoadingState v-if="loading" />

    <!-- Product grid -->
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in availableProducts"
        :key="product.id"
        :product="product"
        :canAdd="productIsInStock(product)"
        @add="addToCart(product)"
      />
    </div>

    <!-- Empty state -->
    <EmptyState v-if="!loading && availableProducts.length === 0" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';
import ProductCard from '@/components/products/ProductCard.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const { loading, availableProducts, productIsInStock, addToCart, fetchProducts } = useProducts();

onMounted(fetchProducts);
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.product-list-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

.product-count {
  background-color: #f0f0f0;
  color: #666;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}

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

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  color: #666;
}
</style>
