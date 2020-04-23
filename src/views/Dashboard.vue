<template>
  <div>
    <slideout-panel></slideout-panel>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item v-on:click="showAddTransaction">
          <i title="Add a Transaction" class="fa fa-plus"></i>
        </b-nav-item>
        <b-nav-item v-on:click="showAddMonthlyTransactions" data-hint='Welcome to CivMoney. To get started add this months Incomes and Expense here. Once added the visuals begin!'>
          <i title="Monthly Income & Expenses" class="fa fa-calendar"></i>
        </b-nav-item>
        <b-nav-item v-on:click="showSearchTransactions">
          <i title="Search Transactions" class="fa fa-search"></i>
        </b-nav-item>
        <b-nav-item to="/stats">
          <i title="Statistics" class="fa fa-percent"></i>
        </b-nav-item>
        <b-nav-item to="/averages">
          <i title="Averages" class="fas fa-thermometer-empty"></i>
        </b-nav-item>
        <b-nav-item to="/year">
          <i title="Year" class="fas fa-signal"></i>
        </b-nav-item>
      </view-nav>
      <div class="row h-100">
        <vodal
          :show="show"
          animation="slideUp"
          @hide="hideModal()"
          :width="modalWidth"
          :height="modalHeight"
          :duration="500"
          :closeButton="false"
          :closeOnEsc="true">
          <bar :year="Number(selectedYear)" :month="monthBar" :date="selectedDate"></bar>
        </vodal>
        <year-bar v-if="monthData.length === 0" :data="data" v-on:draw-month="showMonth" v-on:draw-month-modal="showMonthModal"></year-bar>
        <month-bar v-else :data="monthData" v-on:draw-date-modal="showDateModal"></month-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import totals from "../services/totals";
import Bar from "../components/bar";
import AddTransaction from "../components/addtransaction";
import MonthlyTransactions from "../components/monthlytransactions";
import SearchTransactions from '../components/serachtransactions';
import ViewNav from '../components/viewnav';
import introJs from 'intro.js';

import YearBar from '../components/yearbar';
import MonthBar from '../components/monthbar';

export default {
  name: "dashboard",
  components: { Bar, ViewNav, YearBar, MonthBar },
  data() {
    return {
      modalHeight: 0,
      modalWidth: 0,
      show: false,
      error: "",
      selectedDate: "",
      selectedMonth: "",
      monthBar: "",
      data: [],
      monthData: []
    };
  },
  watch: {
     '$route.hash': function(val){
        if(val){
            const hashRouteSplit = val.split("#")[1].split("/");
            if(hashRouteSplit[1]){
              this.selectedMonth = hashRouteSplit[1];
            } else if (!hashRouteSplit[1] && this.years[this.selectedYear]) {
              this.monthData = [];
              this.data = this.years[this.selectedYear].months;
            }
        }
    },
    selectedMonth: function(newVal) {
      if(this.selectedYear){
        this.$router.push({name: 'home', hash: `#${this.selectedYear}/${this.selectedMonth}`});
        this.monthData = [];
        if (newVal === "") this.data = this.years[this.selectedYear].months
        this.getTotalPerDayForMonth();
      }
    },
    selectedYear: function() {
      this.$router.push({name: 'home', hash: `#${this.selectedYear}`});
      if(this.years[this.selectedYear]){
        this.monthData = []
        this.data = this.years[this.selectedYear].months
      }
    },
    selectableYears: function() {
      if(this.years[this.selectedYear]){
        this.monthData = []
        this.data = this.years[this.selectedYear].months
      }
    }
  },
  mounted: function() {
    this.modalHeight = window.innerHeight / 2;
    if (window.innerWidth > 1500) {
      this.modalWidth = window.innerWidth / 3;
    } else {
      this.modalWidth = window.innerWidth - 100;
    }
    window.onresize = () => {
      if (window.innerWidth > 1500) {
        this.modalWidth = window.innerWidth / 3;
      } else {
        this.modalWidth = window.innerWidth - 100;
      }
      this.modalHeight = window.innerHeight / 2;
    };
    if(localStorage.getItem('cm--intro-seen') !== 'seen'){
      introJs.introJs().addHints().onhintclose(() => { localStorage.setItem('cm--intro-seen', 'seen') });
    }
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me", "selectedYear", "selectableYears"]),
  },
  methods: {
    ...mapActions(["getYears"]),
    showAddTransaction(){
     this.$showPanel({
        component: AddTransaction,
        height: ((this.modalHeight * 2) / 100) * 27.5,
        openOn: 'top',
        cssClass: 'slideout-bg'
     }); 
    },
    showAddMonthlyTransactions(){
      this.$showPanel({
        component: MonthlyTransactions,
        height: ((this.modalHeight * 2) / 100) * 75,
        openOn: 'top',
        cssClass: 'slideout-bg'
     }); 
    },
    showSearchTransactions(){
      this.$showPanel({
        component: SearchTransactions,
        height: ((this.modalHeight * 2) / 100) * 75,
        openOn: 'top',
        cssClass: 'slideout-bg'
     }); 
    },
    async getTotalPerDayForMonth() {
      if (!this.selectedMonth) return;
      this.monthData = []
      try {
        var response = await totals.getTotalPerDayForMonth(
          this.selectedYear,
          this.selectedMonth
        );
        this.monthData = response.data
      } catch (error) {
        this.error = error.repsonse.data;
      }
    },
    hideModal(){
      this.show = false;
    },
    showMonth(month){
      this.selectedMonth = month;
    },
    showMonthModal(month){
      this.show = true;
      this.monthBar = month;
    },
    showDateModal(date){
      this.show = true;
      this.selectedDate = date;
    }
  }
};
</script>
