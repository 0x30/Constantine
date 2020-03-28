import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router/index";

import "normalize.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "markdown-it-latex/dist/index.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
