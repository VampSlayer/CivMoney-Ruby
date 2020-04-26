<template>
  <div>
    <slideout-panel></slideout-panel>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item v-on:click="showAddTransaction">
          <i title="Add a Transaction" class="fa fa-plus"></i>
        </b-nav-item>
        <b-nav-item v-on:click="showAddMonthlyTransactions" data-hint="Welcome to CivMoney. To get started add this months Incomes and Expense here. Once added the visuals begin!">
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
          v-on:hide="hideModal"
          :width="modalWidth"
          :height="modalHeight"
          :duration="500"
          :closeButton="false"
          :closeOnEsc="true">
          <modal-graph :year="Number(selectedYear)" :month="monthBar" :date="selectedDate" :showing="show"></modal-graph>
        </vodal>
        <year-bar v-if="monthData.length === 0" :data="data" v-on:draw-month="showMonth" v-on:draw-month-modal="showMonthModal"></year-bar>
        <month-bar v-else :data="monthData" v-on:draw-date-modal="showDateModal"></month-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import introJs from "intro.js";
import totals from "../services/totals";
import ModalGraph from "../components/modalgraph";
import AddTransaction from "../components/addtransaction";
import MonthlyTransactions from "../components/monthlytransactions";
import SearchTransactions from "../components/serachtransactions";
import ViewNav from "../components/viewnav";
import YearBar from "../components/yearbar";
import MonthBar from "../components/monthbar";

export default {
  name: "dashboard",
  components: { ModalGraph, ViewNav, YearBar, MonthBar },
  data() {
    return {
      modalHeight: 0,
      modalWidth: 0,
      show: false,
      error: "",
      selectedDate: "",
      monthBar: "",
      data: [],
      monthData: []
    };
  },
  watch: {
    selectedMonth: function(newVal) {
      if(this.selectedYear){
        this.monthData = [];
        if (newVal === "") this.data = this.years[this.selectedYear].months
        this.getTotalPerDayForMonth();
      }
      if (newVal === "") this.data = this.years[this.selectedYear].months
    },
    selectedYear: function() {
      if(this.years[this.selectedYear]){
        this.monthData = []
        this.updateSelectedMonth("")
        this.data = this.years[this.selectedYear].months
      }
    },
    selectableYears: function() {
      if(this.years[this.selectedYear]){
        this.monthData = []
        this.updateSelectedMonth("")
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
    if(localStorage.getItem("cm--intro-seen") !== "seen"){
      introJs.introJs().addHints().onhintclose(() => { localStorage.setItem("cm--intro-seen", "seen") });
    }
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me", "selectedYear", "selectableYears", "selectedMonth"]),
  },
  methods: {
    ...mapActions(["getYears"]),
    ...mapMutations(["updateSelectedMonth"]),
    showAddTransaction(){
     this.$showPanel({
        component: AddTransaction,
        height: ((this.modalHeight * 2) / 100) * 27.5,
        openOn: "top",
        cssClass: "slideout-bg"
     }); 
    },
    showAddMonthlyTransactions(){
      this.$showPanel({
        component: MonthlyTransactions,
        height: ((this.modalHeight * 2) / 100) * 75,
        openOn: "top",
        cssClass: "slideout-bg"
     }); 
    },
    showSearchTransactions(){
      this.$showPanel({
        component: SearchTransactions,
        height: ((this.modalHeight * 2) / 100) * 75,
        openOn: "top",
        cssClass: "slideout-bg"
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
      this.selectedDate = ""
      this.monthBar = ""
      this.show = false;
    },
    showMonth(month){
      this.updateSelectedMonth(month);
    },
    showMonthModal(month){
      this.selectedDate = ""
      this.monthBar = month;
      this.show = true;
    },
    showDateModal(date){
      this.monthBar = ""
      this.selectedDate = date;
      this.show = true;
    }
  }
};
</script>
