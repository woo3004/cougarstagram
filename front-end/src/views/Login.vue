<template>
  <div>
    <div v-if='accountCreated'>
      <p style='margin-top:119px;'>
      <h2>Thank you for Registering,</h2>
      <h3>Now <router-link to='/'>share your campus life </router-link>with others!</h3>
    </div>
    <div v-else>
      <p style='margin-top:119px;'>
      <h1 v-if='createAccount'>Create an account</h1>
      <h1 v-else>Sign in</h1>
      <p style='margin-bottom:0;'>to continue to cougarstagram</p>
      <div class='main-container'>
        <form class='container'>
          <input class='login-box' v-model='username' placeholder='Username'>
          <input type='password' class='login-box' v-model='password' placeholder='Password'>
          <input type='password' v-if='createAccount' class='login-box' v-model='confirmPassword' placeholder='Confirm password'>
          
          <button v-if='createAccount' id='createAccount' @click.prevent='addUser'>Create Account</button>
          <button v-else @click.prevent='login'>Sign in</button>
          <div v-if='!createAccount'><a @click='switchAccount'>Create Account</a></div>
          <div v-else><a @click='switchAccount'>Back to sign in</a></div>
        </form>
      </div>
    </div>
    <p v-if='errorMessage' id='error'>{{errorMessage}}</p>
  </div>
</template>

<script>
import axios from 'axios';
  export default {
    name: 'Login',
    data() {
      return {
        username: "",
        password: "",
        confirmPassword: "",
        createAccount: false,
        accountCreated: false,
        errorMessage: "",
        staySignedIn: false
      }
    },
    methods: {
      async addUser() {
        if (!this.username || !this.password) {
          this.errorMessage = "please enter username and password!"
          return;
        }
        if (this.password != this.confirmPassword) {
          this.errorMessage = "passwords do not match!"
          return;
        }
        try {
          let response = await axios.post('/api/users', {
            username: this.username,
            password: this.password
          });
          this.$root.$data.user = response.data.user;
          this.username = this.password = "";
          this.accountCreated = true;
          this.errorMessage = ""
        } catch (error) {
          this.errorMessage = error.response.data.message;
          console.log(this.errorMessage)
        }
      },
      async login() {
        if (!this.username || !this.password) {
          this.errorMessage = "please enter username and password!"
          return;
        }
        try {
          let response = await axios.post('/api/users/login', {
            username: this.username,
            password: this.password
          });
          this.$root.$data.user = response.data.user;
          this.errorMessage = ""
          this.$router.push({ name: 'Home' })
        } catch (error) {
          this.errorMessage = error.response.data.message;
          this.$root.$data.user = null;
        }
      },
      switchAccount() {
        this.password = this.confirmPassword = this.errorMessage = ""
        this.createAccount = !this.createAccount
      }
    } 
  }
</script>

<style scoped>
h1 {
  margin-top: 1.5em;
}
.main-container {
  display: flex;
  justify-content: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  box-shadow: gray 1px;
  height: 200px;
}
.login-box {
  width: 200px;
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  margin-bottom: 10px;
}

label {
  margin-bottom: 20px;
}
input {
  font-size: 1em;
}
a {
  cursor: pointer;
  color: #264fa8;
}
#error {
  color: red;
}
</style>