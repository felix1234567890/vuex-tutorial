<template>
  <div>
    <h1>Shopping cart</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{product.title}} - {{product.price | currency}} - {{product.quantity}}
      </li>
    </ul>
    <p>Total: {{total |currency}}</p>
    <button @click="checkout">Check out</button>
    <p v-if="checkoutStatus">{{checkoutStatus}}</p>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      products: "cartProducts",
      total: "cartTotal"
    }),
    // products() {
    //   return this.$store.getters.cartProducts;
    // },
    // total() {
    //   return this.$store.getters.cartTotal;
    // }
    ...mapState({ checkoutStatus: state => state.cart.checkoutStatus })
  },
  methods: {
    ...mapActions(["checkout"])
  }
};
</script>

<style>
</style>
