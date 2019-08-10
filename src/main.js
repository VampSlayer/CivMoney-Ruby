import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";

import VueSlideoutPanel from 'vue2-slideout-panel';
Vue.use(VueSlideoutPanel);

import Vodal from 'vodal';
Vue.component(Vodal.name, Vodal);

import 'vodal/common.css';
import 'vodal/slide-down.css'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "vue-multiselect/dist/vue-multiselect.min.css";

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
