<style>
.civ-nav-bg{
  background-color: #248df0;
}
body{
  background-color: #153057 !important;
  color: white !important;
}
.page-footer{
  font-size:0.75em;
  color:#77778f;
}
</style>

<template>
  <div>
    <header v-if="me">
      <b-navbar toggleable="lg" type="dark" class="civ-nav-bg">
        <b-navbar-brand to="/"><img width="34px"  class="d-inline-block align-top" src="https://i.imgur.com/JlQV6Co.png"/>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text>{{me.username}}</b-nav-text>
            <b-nav-item v-on:click="showProfile"><i title="Your Profile" class="fas fa-cog"></i></b-nav-item>
            <b-nav-item v-on:click="logout"><i title="Logout" class="fas fa-power-off"></i></b-nav-item>
          </b-navbar-nav>
        </b-collapse>

      </b-navbar>
    </header>
    <slideout-panel></slideout-panel>
    <router-view class="container-fluid" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AddTransaction from "./components/addtransaction";
export default {
  name: "app",
  computed: {
    ...mapState(['me'])
  },
  methods: {
    ...mapActions(['logout']),
    showProfile(){
      this.$showPanel({
        component: AddTransaction,
        height: ((window.innerHeight) / 100) * 20,
        openOn: 'top',
        cssClass: 'slideout-bg'
     }); 
    }
  }
};
</script>
