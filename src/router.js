import Vue from "vue";
import Router from "vue-router";
import Guard from './services/auth.middleware'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */'./views/Login.vue'),
      beforeEnter: Guard.guest
    },
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
      beforeEnter: Guard.auth
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import(/* webpackChunkName: "stats" */ "./views/Stats.vue"),
      beforeEnter: Guard.auth
    },
    {
      path: "/averages",
      name: "averages",
      component: () => import(/* webpackChunkName: "averages" */ "./views/Averages.vue"),
      beforeEnter: Guard.auth
    },
    {
      path: "/year",
      name: "year",
      component: () => import(/* webpackChunkName: "year" */ "./views/YearGrouping.vue"),
      beforeEnter: Guard.auth
    }
  ]
});
