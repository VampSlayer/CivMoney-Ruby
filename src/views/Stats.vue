<template>
    <div>
    <div class="mt-2 h-100">
      <div class="row">
        <div class="col-4">
          <b-nav align="left">
            <b-nav-item to="/">
              <i title="Dashboard" class="fas fa-chart-bar"></i>
            </b-nav-item>
          </b-nav>
        </div>
        <div class="col-8">
          <b-nav align="right">
            <b-nav-item
              active-class="year-active"
              v-for="(year, index) in sortedYears"
              :key="index"
              :active="year == selectedYear"
              v-on:click="selectedYear = year;"
            >{{ year }}</b-nav-item>
          </b-nav>
        </div>
      </div>
      <div class="h-100">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <p class="text-center" style="font-size: 300px">$</p>
            </div>
        </div>
        <div class="row h-20">
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
            <div class="col">
                $
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    name: 'Stats',
    data() {
        return {
            selectedYear: ''
        }
    },
    created: function() {
        this.getYears();
    },
    watch: {
        selectableYears: function() {
            if (this.selectableYears && this.selectableYears.length > 0) {
                this.selectedYear = Math.max(this.selectableYears);
            }
        }
    },
    computed: {
        ...mapState(["years", "me", "selectableYears"]),
        sortedYears: function(){
            return this.selectableYears.sort((a, b) => {return a - b});
        },
    },
    methods: {
        ...mapActions(["getYears"])
    }
}
</script>