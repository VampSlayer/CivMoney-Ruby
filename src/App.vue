<style scoped>
.h-container{
  height: calc(100% - 120px) !important;
}
.no-transform a {
  transform: none !important;
}
.no-transform a:hover {
  text-decoration: underline;
}
.mi-Contact {
  margin-right: 5px;
}
.mi-PowerButton {
  font-weight: 600;
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
            <b-nav-item class="mr-1 no-transform" v-on:click="showProfile" title="User Profile"><i title="Your Profile" class="mi mi-Contact"></i> {{me.username}}</b-nav-item>
            <b-nav-item v-on:click="logout">
              <GoogleLogin class="google-logout" :logoutButton="true" :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
                <i title="Logout" class="mi mi-PowerButton"></i>
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
  created() {
    this.getTopDescriptions()
  },
  mounted() {
    window.addEventListener("resize", this.debouncedGetYears)
  },
  computed: {
    ...mapState(["me", "theme"]),
  },
  methods: {
    ...mapActions(["logout", "loginFaliure", "getYears", "getTopDescriptions"]),
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
    },
  }
};
</script>
