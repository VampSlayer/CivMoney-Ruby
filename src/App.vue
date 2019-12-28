<style>
.civ-nav-bg{
  background-color: #248df0;
}
html, body{
  background-color: #153057 !important;
  color: white !important;
  height: 100%;
  font-family: 'Roboto', sans-serif !important;
}
.page-footer{
  font-size:0.75em;
  color:#77778f;
}
.google-logout{
  background: transparent;
  border: none;
  padding-left: 0 !important;
  color: rgba(255, 255, 255, 0.5);
}
.google-logout:hover{
  color: rgba(255, 255, 255, 0.75);
}
.nav-item .active {
  color: white !important;
}
</style>

<style scoped>
.h-container{
  height: calc(100% - 120px) !important;
}
</style>

<template>
  <div class="h-100">
    <header v-if="me">
      <b-navbar toggleable="lg" type="dark" class="civ-nav-bg">
        <b-navbar-brand to="/"><img width="34px"  class="d-inline-block align-top" src="https://i.imgur.com/JlQV6Co.png"/>
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
import { mapState, mapActions } from 'vuex';
import keys from '@/config/keys';
import GoogleLogin from 'vue-google-login';
import Profile from '@/components/profile';
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
  computed: {
    ...mapState(['me'])
  },
  methods: {
    ...mapActions(['logout', 'loginFaliure']),
    showProfile(){
      this.$showPanel({
        component: Profile,
        height: ((window.innerHeight) / 100) * 27.5,
        openOn: 'top',
        cssClass: 'slideout-bg'
     });
    },
    async onSuccess(){
      await this.logout()
    },
    onFailure(error){
      this.loginFaliure(error);
    },
  }
};
</script>
