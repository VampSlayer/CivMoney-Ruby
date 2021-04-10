<template>
  <div>
    <slideout-panel></slideout-panel>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item v-on:click="showAddTransaction">
          <i title="Add a Transaction" class="mi mi-Add"></i>
        </b-nav-item>
        <b-nav-item v-if="!userHasData && !userHasSeenIntro" class="intro-pulse" v-on:click="showIntroModal">
          <i title="Introduction" class="mi mi-Calendar"></i>
        </b-nav-item>
        <b-nav-item v-else :class="{'intro-pulse': !userHasData}" v-on:click="showAddMonthlyTransactions">
          <i title="Add Monthly Income & Expenses" class="mi mi-Calendar"></i>
        </b-nav-item>
        <b-nav-item v-on:click="showSearchTransactions">
          <i title="Search Transactions" class="mi mi-Search"></i>
        </b-nav-item>
        <b-nav-item to="/stats">
          <i title="Monthly & Yearly Statistics" class="mi mi-CalculatorPercentage"></i>
        </b-nav-item>
        <b-nav-item to="/year">
          <i title="Yearly Breakdown By Description" class="mi mi-CollateLandscape"></i>
        </b-nav-item>
          <b-nav-item to="/total">
          <i title="Net Total & Total Breakdown" class="mi mi-Calculator"></i>
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
          <modal-graph v-if="userHasData" :year="Number(selectedYear)" :month="monthBar" :date="selectedDate" :showing="show"></modal-graph>
          <intro v-else></intro>
        </vodal>
        <year-bar v-if="monthData.length === 0" :data="data" v-on:draw-month="showMonth" v-on:draw-month-modal="showMonthModal"></year-bar>
        <month-bar v-else :data="monthData" v-on:draw-date-modal="showDateModal"></month-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import totals from "../services/totals";
import ModalGraph from "../components/modalgraph";
import AddTransaction from "../components/addtransaction";
import MonthlyTransactions from "../components/monthlytransactions";
import SearchTransactions from "../components/serachtransactions";
import ViewNav from "../components/viewnav";
import YearBar from "../components/yearbar";
import MonthBar from "../components/monthbar";
import Intro from "../components/intro";
import utils from '../services/utils';

export default {
  name: "dashboard",
  components: { ModalGraph, ViewNav, YearBar, MonthBar, Intro },
  data() {
    return {
      modalHeight: 0,
      modalWidth: 0,
      show: false,
      error: "",
      selectedDate: "",
      monthBar: "",
      data: [],
      monthData: [],
      userHasSeenIntro: localStorage.getItem("cm--intro-seen") === "true",
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
   mounted() {
    this.setModalSize()
    window.onresize = () => { this.setModalSize() };
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me", "selectedYear", "selectableYears", "selectedMonth"]),
    userHasData() {
      return this.data.length
    }
  },
  methods: {
    ...mapActions(["getYears"]),
    ...mapMutations(["updateSelectedMonth"]),
    showAddTransaction(){
     this.$showPanel({
        component: AddTransaction,
        height: ((this.modalHeight * 2) / 100) * 35,
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
    },
    showIntroModal() {
      this.show = true
      this.userHasSeenIntro = true
      localStorage.setItem("cm--intro-seen", true)
    },
    setModalSize() {
      const modalSize = utils.calculateModalSize()
      this.modalHeight = modalSize.height
      this.modalWidth = modalSize.width
    }
  }
};
</script>
