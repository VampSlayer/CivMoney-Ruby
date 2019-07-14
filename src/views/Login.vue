<template>
  <div>
    <h1>Login</h1>
    <b-form @submit="login(loginData)">
      <b-form-input v-model="loginData.username" placeholder="Enter your username"></b-form-input>
      <b-form-input type="password" v-model="loginData.password" placeholder="Enter your password"></b-form-input>
      <b-button variant="danger" type="submit">Login</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: "login",
  data(){
    return{
      loginData: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState(['loggingIn', 'loginError'])
  },
  methods: {
    ...mapActions(['login'])
  }
};
</script>
