import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isNavgationBarSticky: "false"
  },
  mutations: {
    setIsNavgationBarSticky(state, isSticky) {
      state.isNavgationBarSticky = isSticky
    }
  },
  actions: {},
  modules: {}
});
