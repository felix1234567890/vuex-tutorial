<template>
  <div id="app">
    <AppHeader />

    <main class="app-content">
      <ProductList />
      <div class="divider" />
      <ShoppingCart />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import ProductList from "@/components/ProductList.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "App",
  components: {
    ProductList,
    ShoppingCart,
    AppHeader,
    AppFooter
  }
};
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f8f9fa;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 40px 0;
}
</style>
