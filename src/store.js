import Vue from "vue";
import Vuex from "vuex";
import router from "./router"
import user from './services/auth';
import totals from './services/totals';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    me: null,
    years: {},
    loggingIn: false,
    loginError: null
  },
  mutations: {
    loginStart: state => (state.loggingIn = true),
    loginStop: (state, errorMessage) => {
      state.loggingIn = false;
      state.loginError = errorMessage;
    },
    updateMe: (state, me) => {
      state.me = me;
    },
    updateYears: (state, years) => {
      state.years = years;
    }
  },
  actions: {
    async getYears({ commit }){
      try {
        var response = await totals.years();
        commit("updateYears", response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async login({ commit }, loginData) {
      commit("loginStart");
      try {
        await user.login(loginData);
        router.push('/');
      } catch (error) {
        commit("loginStop", error.response);
        commit("updateMe", null);
      }
    },
    async logout() {
      await user.logout();
      user.remove();
      router.push('/login');
    }
  }
});
