import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store/index.js"; // This will be updated later if store creation changes
import { currency } from "../currency";

const app = createApp(App);

app.config.productionTip = false; // In Vue 3, productionTip is true by default and this line is not strictly necessary but kept for explicitness.
app.config.globalProperties.$currency = currency;

app.use(store);
app.mount("#app");
