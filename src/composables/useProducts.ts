import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import type { Product } from '@/store/modules/products';

export function useProducts() {
  const store = useStore();
  const loading = ref(false);

  const availableProducts = computed(() => store.getters['products/availableProducts']);
  const productIsInStock = (product: Product) => store.getters['products/productIsInStock'](product);
  const addToCart = (product: Product) => store.dispatch('cart/addProductToCart', product);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      await store.dispatch('products/fetchProducts');
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      loading.value = false;
    }
  };

  return { loading, availableProducts, productIsInStock, addToCart, fetchProducts };
}
