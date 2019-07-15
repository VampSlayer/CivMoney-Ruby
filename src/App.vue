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
        <b-navbar-brand to="/">Logo</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text>{{me.firstName}}</b-nav-text>
            <b-nav-item to="/profile"><i title="Your Profile" class="fas fa-cog"></i></b-nav-item>
            <b-nav-item v-on:click="logout"><i title="Logout" class="fas fa-power-off"></i></b-nav-item>
          </b-navbar-nav>
        </b-collapse>

      </b-navbar>
    </header>
    <router-view class="container-fluid" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: "app",
  computed: {
    ...mapState(['me'])
  },
  methods: {
    ...mapActions(['logout'])
  }
};
</script>
