<template>
  <div>
    <h2>Product List</h2>
    <img v-if="loading" src="https://s3.amazonaws.com/ceblog/wp-content/uploads/2012/03/spinner-css3-animations.jpg" alt="">
    <ul>
      <li v-for="product in products" :key="product.id">
        {{product.title}} - {{product.price}} - {{product.inventory}}
        <button :disabled="!productIsInStock(product)" @click="addProductToCart(product)">Add to cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState({ products: state => state.products.items }),
    ...mapGetters({ productIsInStock: "productInStock" })
  },

  // productIsInStock() {
  //   return this.$store.getters.productInStock;
  // }
  methods: {
    ...mapActions({
      fetchProducts: "fetchProducts",
      addProductToCart: "addProductToCart"
    })
    // addProductToCart(product) {
    //   this.$store.dispatch("addProductToCart", product);
    // }
  },
  created() {
    this.loading = true;
    this.fetchProducts().then(() => (this.loading = false));
  }
};
</script>

<style>
</style>
