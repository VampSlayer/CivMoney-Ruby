import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import user from "./services/auth";
import totals from "./services/totals";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    me: null,
    years: {},
    selectableYears: [],
    selectedYear: null,
    selectedMonth: null,
    loggingIn: false,
    loginError: null,
    theme: {}
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
    },
    updateSelectableYears: (state, years) => {
      years = years.sort((a, b) => { return a - b; });
      state.selectableYears = years;
    },
    updateSelectedYear: (state, year) => {
      state.selectedYear = year;
    },
    updateSelectedMonth: (state, month) => {
      state.selectedMonth = month;
    },
    updateTheme: (state, theme) => {
      state.theme = theme;
    }
  },
  actions: {
    async getYears({ commit }) {
      try {
        let yearTotalsResponse = await totals.years();
        let years = yearTotalsResponse.data;
        let yearsMap = {};
        let selectableYears = [];
        await years.forEach(async (year) => {
          let monthTotalsResponse = await totals.getTotalPerMonthForYear(year.dateyear);
          yearsMap[year.dateyear] = {
            amount: year.amount,
            months: monthTotalsResponse.data
          };
          selectableYears.push(year.dateyear);
          commit("updateSelectableYears", selectableYears);
          if (router.app.$route.hash && router.app.$route.hash.split("#")[1].split("/")[0])
          {
            commit("updateSelectedYear", router.app.$route.hash.split("#")[1].split("/")[0]);
          }
          else {
            commit("updateSelectedYear", selectableYears[selectableYears.length - 1]);
          }
        });
        commit("updateYears", yearsMap);
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    },
    loginFaliure({ commit }, error) {
      commit("loginStop", error.response);
      commit("updateMe", null);
    },
    async login({ commit }, googleUser) {
      commit("loginStart");
      try {
        var id_token = googleUser.getAuthResponse().id_token;
        await user.login(id_token);
        router.push("/");
      } catch (error) {
        commit("loginStop", error.response);
        commit("updateMe", null);
      }
    },
    async logout() {
      await user.logout();
      user.remove();
      router.push("/login");
    }
  }
});
