import { createStore } from "vuex";
import cart from "./modules/cart";
import products from "./modules/products";

import actions from "./actions";

export default createStore({
  modules: { cart, products },
  state: {},
  getters: {},
  actions,
  mutations: {}
});
