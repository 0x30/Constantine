import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router/index";

import "normalize.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "markdown-it-latex/dist/index.css";
import "@/assets/styles/public.scss";

import "@/assets/styles/markdown.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
