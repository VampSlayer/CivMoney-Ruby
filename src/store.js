import Vue from "vue";
import Vuex from "vuex";
import router from "./router"
import user from './services/auth';
import totals from './services/totals';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    me: null,
    years: {},
    selectableYears: [],
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
    },
    updateSelectableYears: (state, years) => {
      state.selectableYears = years;
    }
  },
  actions: {
    async getYears({ commit }){
      try {
        let response = await totals.years();
        let years = response.data;
        let yearsMap = {};
        let selectableYears = [];
        await years.forEach(async (year) =>  {
          let response = await totals.getTotalPerMonthForYear(year.dateyear);
          let data = response.data;
          let months = data.map(x => {return x.datemonth});
          data.forEach(x => {
            x.datemonth = moment(`${year.dateyear}-${x.datemonth}-01`).format()
          });
          [1,2,3,4,5,6,7,8,9,10,11,12].forEach(x => {
            if(!months.includes(x)){
              data.push({
                amount: 0,
                datemonth: moment(`${year.dateyear}-${x}-01`).format()
              })
            }
          });
          yearsMap[year.dateyear] = {};
          yearsMap[year.dateyear].amount = year.amount;
          yearsMap[year.dateyear].months = data.sort(function(a,b){
            return new Date(a.datemonth) - new Date(b.datemonth);
          });
          selectableYears.push(year.dateyear);
        });
        commit("updateSelectableYears", selectableYears);
        commit("updateYears", yearsMap);
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
