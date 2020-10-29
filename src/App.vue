<style scoped>
.h-container{
  height: calc(100% - 120px) !important;
}
</style>

<template>
  <div class="h-100">
    <header v-if="me">
      <b-navbar toggleable="lg" type="dark" class="civ-nav-bg">
        <b-navbar-brand>
          <img v-if="theme.logo === 0" width="34px" class="d-inline-block align-top" src="https://i.imgur.com/xIzOjYI.png"/>
          <img v-else width="34px" class="d-inline-block align-top"  src="https://i.imgur.com/JlQV6Co.png"/>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text>{{me.username}}</b-nav-text>
            <b-nav-item v-on:click="showProfile"><i title="Your Profile" class="fas fa-cog"></i></b-nav-item>
            <b-nav-item v-on:click="logout">
              <GoogleLogin class="google-logout" :logoutButton="true" :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
                <i title="Logout" class="fas fa-power-off"></i>
              </GoogleLogin>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <slideout-panel></slideout-panel>
    <router-view class="container-fluid h-container" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import keys from "./config/keys";
import GoogleLogin from "vue-google-login";
import Profile from "./components/profile";

export default {
  name: "app",
  components: {
    GoogleLogin
  },
  data(){
    return{
      params: {
        client_id: keys.googleClientID
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.debouncedGetYears)
  },
  computed: {
    ...mapState(["me", "theme"]),
  },
  methods: {
    ...mapActions(["logout", "loginFaliure", "getYears"]),
    showProfile(){
      this.$showPanel({
        component: Profile,
        height: ((window.innerHeight) / 100) * 27.5,
        openOn: "top",
        cssClass: "slideout-bg"
     });
    },
    async onSuccess(){
      await this.logout()
    },
    onFailure(error){
      this.loginFaliure(error);
    },
    mappedGetYears(){
      if (!this.me) return;
      this.getYears()
    },
    debouncedGetYears() {
      return this.debounce(this.mappedGetYears, 200);
    },
    debounce(func, wait, immediate) {
      let timeout;
      return function() {
        const context = this, args = arguments;
        let later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      }
    }
  }
};
</script>
