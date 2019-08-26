<style>
.vodal-dialog{ 
  border: 1px solid #248df0 !important;
  background-color: #153057 !important;
  border-radius: 0px !important;
}
#chartdiv {
  width: 100%;
  height: 100%;
}
.nav-item .active {
  color: white !important;
}
.slideout-bg{
  background-color: #248df0 !important;
}
</style>

<template>
  <div>
    <slideout-panel></slideout-panel>
    <div class="mt-2 h-100">
      <div class="row">
        <div class="col-4">
          <b-nav align="left">
            <b-nav-item v-on:click="showAddTransaction">
              <i title="Add a Transaction" class="fa fa-plus"></i>
            </b-nav-item>
            <b-nav-item v-on:click="showAddMonthlyTransactions">
              <i title="Add Monthly Transactions" class="fa fa-calendar"></i>
            </b-nav-item>
            <b-nav-item v-on:click="showSearchTransactions">
              <i title="Search Transactions" class="fa fa-search"></i>
            </b-nav-item>
          </b-nav>
        </div>
        <div class="col-8">
          <b-nav align="right">
            <b-nav-item
              active-class="year-active"
              v-for="(year, index) in selectableYears"
              :key="index"
              :active="year === selectedYear"
              v-on:click="selectedYear = year; selectedMonth = ''"
            >{{ year }}</b-nav-item>
          </b-nav>
        </div>
      </div>
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
          <bar :year="selectedYear" :month="monthBar" :date="selectedDate"></bar>
        </vodal>
        <div id="chartdiv"></div>
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
import graphing from "../services/graphing";
export default {
  name: "dashboard",
  components: {
    Bar
  },
  data() {
    return {
      modalHeight: 0,
      modalWidth: 0,
      show: false,
      selectedYear: 0,
      error: "",
      selectedMonth: "",
      selectedDate: "",
      monthBar: "",
    };
  },
  watch: {
    '$route.hash': function(val){
          if(val){
            const hashRouteSplit = val.split("#")[1].split("/");
            if(hashRouteSplit[0]) this.selectedYear = parseInt(hashRouteSplit[0]);
            if(hashRouteSplit[1]) this.selectedMonth = hashRouteSplit[1];
            if(!hashRouteSplit[1]) this.selectedMonth = ""
          }
    },
    selectedMonth: function(newVal) {
      if(this.selectedYear){
        this.$router.push({name: 'home', hash: `#${this.selectedYear}/${this.selectedMonth}`});
        if (newVal === "") graphing.graphYear("chartdiv", this.years[this.selectedYear].months, this);
        this.getTotalPerDayForMonth();
      }
    },
    selectedYear: function() {
      this.$router.push({name: 'home', hash: `#${this.selectedYear}/${this.selectedMonth}`});
      if(this.years[this.selectedYear]){
        graphing.graphYear("chartdiv", this.years[this.selectedYear].months, this);
      }
    },
    selectableYears: function() {
      const oldSelectedYear = this.selectedYear;
      if (this.selectableYears && this.selectableYears.length > 0) {
        this.selectedYear = Math.max(this.selectableYears);
        if(this.$route.hash){
          const hashRouteSplit = this.$route.hash.split("#")[1].split("/");
          if(hashRouteSplit[0]) this.selectedYear = parseInt(hashRouteSplit[0]);
          if(hashRouteSplit[1]) this.selectedMonth = hashRouteSplit[1];
        } 
        const newSelectedYear = this.selectedYear;
        if(oldSelectedYear === newSelectedYear){
          graphing.graphYear("chartdiv", this.years[this.selectedYear].months, this);
        }
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
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me", "selectableYears"])
  },
  methods: {
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
    hideModal(){
      this.show = false;
    },
    ...mapActions(["getYears"]),
    async getTotalPerDayForMonth() {
      if (!this.selectedMonth) return;
      try {
        var response = await totals.getTotalPerDayForMonth(
          this.selectedYear,
          this.selectedMonth
        );
        graphing.graphMonth("chartdiv", response.data, this);
      } catch (error) {
        this.error = error.repsonse.data;
      }
    }
  }
};
</script>
