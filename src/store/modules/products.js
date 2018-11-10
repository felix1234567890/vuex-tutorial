import shop from "../../api/shop";
export default {
  state: {
    items: []
  },
  getters: {
    products(state) {
      return state.items;
    },
    availableProducts(state) {
      return state.items.filter(product => product.inventory > 0);
    },

    productInStock() {
      return product => {
        return product.inventory > 0;
      };
    }
  },
  actions: {
    fetchProducts(context) {
      return new Promise(resolve => {
        shop.getProducts(products => {
          context.commit("setProducts", products);
          resolve();
        });
      });
    }
  },
  mutations: {
    setProducts(state, products) {
      state.items = products;
    },

    decrementProductInventory(state, product) {
      product.inventory--;
    }
  }
};
