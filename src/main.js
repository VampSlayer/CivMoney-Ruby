import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

import VueSlideoutPanel from "vue2-slideout-panel";
Vue.use(VueSlideoutPanel);

import Vodal from "vodal";
Vue.component(Vodal.name, Vodal);

import VCalendar from "v-calendar";
Vue.use(VCalendar, { firstDayOfWeek: 2 });

import theme from "./services/theme"
theme.use();

import "vodal/common.css";
import "vodal/slide-down.css"

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "vue-multiselect/dist/vue-multiselect.min.css";

import "intro.js/minified/introjs.min.css";

import "./assets/themes.css"
import "./assets/style.scss"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
