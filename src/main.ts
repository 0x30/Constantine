import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import "normalize.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import "@fortawesome/fontawesome-free/js/all.js";
import "markdown-it-latex/dist/index.css";
import "@/assets/styles/public.scss";


import "@/assets/styles/ursine/ursine-main.scss";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
