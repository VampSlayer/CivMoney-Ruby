<style scoped>
.login-right {
  background: #248df0;
  height: calc(100% + 120px) !important;
}
.img-div {
  width: 100%;
  height: 100%;
  position: absolute;
}
.img-div img {
  max-width: 100%;
  height: auto;
  position: absolute;
  padding: 2rem;
}
@media only screen and (min-width: 2200px) {
  .img-div img {
    max-width: 100%;
    height: auto;
    position: absolute;
    padding: 2rem;
    left: 10%;
  }
}
.p-civ {
  padding-top: 6em;
  padding-left: 6em;
}
.p-text {
  padding-left: 6em;
  padding-right: 4em;
}
p {
  font-size: 1.1em;
}
.p-button {
  padding-top: 2em;
}
.p-link-group {
  padding-left: 6em;
  position: absolute;
  top: 90%;
}
.img-link {
  height: 40px;
  width: auto;
}
.p-copyright {
  padding-left: 5em;
  position: absolute;
  top: 96%;
}
h1 {
  font-weight: bolder;
}
.text-size-year {
  font-size:0.6em
}
.civ-link {
  font-weight: bolder;
  color:white
}
</style>

<template>
  <div class="row h-100 ml-0 mr-0 pl-0 pr-0">
    <div class="d-none d-md-block col-md-6 col-lg-6 p-0">
      <div class="img-div">
        <img src="https://i.imgur.com/pTFJ7Rg.png" />
      </div>
    </div>
    <div class="col-12 col-sm-12 col-md-6 col-lg-6 p-0 login-right">
      <div class="row ml-0 mr-0 p-civ">
        <div class="col p-0">
          <h1>Welcome to CivMoney</h1>
        </div>
      </div>
      <div class="row ml-0 mr-0 p-text">
        <div class="col p-0">
          <p>
            CivMoney was born out of the game
            <a
              class="cursor civ-link"
              href="https://civilization.com/"
              target="_blank"
              rel="noopener noreferrer">Civilization</a>.
            In Civilization you must be careful that your expenses for your empire are lower than
            your income. If you spend more than you earn you
            go into the
            <span class="red">red</span>.
          </p>
        </div>
      </div>
      <div class="row ml-0 mr-0 p-text">
        <div class="col p-0">
          <p>
            With CivMoney you can manage your income and expenses with
            rich visualizations showing whether you saved, lost or broke even for
            that day, month and year. Try to save more than you spend to stay in the
            <span class="green">green</span>
            or you will end up in the
            <span class="red">red</span>.
          </p>
        </div>
      </div>
      <div class="row ml-0 mr-0 p-button">
        <div class="col d-flex justify-content-center">
          <GoogleLogin
            :params="params"
            :renderParams="renderParams"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
          ></GoogleLogin>
        </div>
      </div>
      <div class="d-none d-xl-block">
        <div class="p-link-group">
          <a class="cursor" href="https://github.com/VampSlayer/CivMoney" target="_blank" rel="noopener noreferrer">
            <img class="img-link" src="https://i.imgur.com/MV1bJll.png" />
          </a>
          <a
            class="pl-3 cursor"
            href="https://www.linkedin.com/in/sayam-hussain-52475210b/"
            target="_blank"
            rel="noopener noreferrer">
            <img class="img-link" src="https://i.imgur.com/V3CSeYq.png" />
          </a>
        </div>
        <div class="row ml-0 mr-0 p-copyright">
          <div class="col d-flex">
            <p class="text-size-year">
              © {{new Date().getFullYear()}}
              <strong>Sayam Hussain</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import keys from "../config/keys";
import GoogleLogin from "vue-google-login";
export default {
  name: "login",
  components: {
    GoogleLogin
  },
  data() {
    return {
      params: {
        client_id: keys.googleClientID
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      }
    };
  },
  computed: {
    ...mapState(["loggingIn", "loginError"])
  },
  methods: {
    async onSuccess(googleUser) {
      await this.login(googleUser);
    },
    onFailure(error) {
      this.loginFaliure(error);
    },
    ...mapActions(["login", "loginFaliure"])
  }
};
</script>
