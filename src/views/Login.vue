<template>
  <div>
    <div class="m-2">
     <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure"></GoogleLogin>
     </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import keys from '../config/keys';
import GoogleLogin from 'vue-google-login';
export default {
  name: "login",
  components: {
    GoogleLogin
  },
  data(){
    return{
      loginData: {
        username: '',
        password: '',
      },
      params: {
        client_id: keys.googleClientID
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      }
    }
  },
  computed: {
    ...mapState(['loggingIn', 'loginError'])
  },
  methods: {
    async onSuccess(googleUser){
      var id_token = googleUser.getAuthResponse().id_token;
      await this.login(id_token)
    },
    onFailure(error){
      this.loginFaliure(error);
    },
    ...mapActions(['login', 'loginFaliure'])
  }
};
</script>
