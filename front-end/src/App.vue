<template>
  <div id="app">
    <div class="page">
      <div id="title-bar">
        <div id="empty"></div>
        <div id="logo">
          <router-link to="/"><img id="logo-image" src="@/assets/logo.png"></router-link>
          <div id='logoText'>CougarStagram</div>
        </div>
        <div id="nav">
          <div class='userInfo' v-if='user'>
            <router-link class='userInfo' to="/account"><div class="top-set"><input type='image' class='topBarIcon' :src="require('@/assets/user.png')"><small>my page</small></div></router-link>
            <div class="top-set"><input class='topBarIcon' type='image' :src='require("@/assets/logout.png")' alt='Sign Out' @click='logout'><small>sign out</small></div>
          </div>
          <router-link class="login" v-if=!user to="/login"><img src="@/assets/login.png"><br><small>Sign In</small></router-link>
        </div>
      </div>
      <router-view/>
      <hr style='margin-top:150px;'>
      <div class="footer"><a href="">http://</a></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  computed: {
    user: function() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users")
        this.$root.$data.user = null;
        this.$router.push({ name: 'Login' })
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
/* @media screen and (max-width: 600px) {
  #logoText {
    visibility: hidden;
  }
  body {
    font-size: .8em;
  }
  h1 {
    font-size: 2em;
  }
}
@media screen and (min-width: 600px) {
  body {
    font-size: 1em;
  }
  #logoText{
    margin-left: 20px;
  }
} */
.page {
  margin: auto;
  width: 1200px;
  border: 2px solid gray;
  border-radius: 10px;
}

h1 {
  font-size: 250%;
  margin: 10px 0 10px 0;
}

.footer {
  margin-bottom: 5px;
}

.footer a{
  text-decoration: none;
}

hr {
  width: 1200px;
}

.userInfo {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.top-set {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.top-set small {
  font-size: 60%;
  color: white;
}

body {
  margin: 0 0 50px 0 !important;
  color: #1f1f1f;
}
.controls {
  width: 25px;
  height: 25px;
  margin: 5px;
}
.icons {
  width: 20px;
  margin: 0 14px;
}

/* #empty {
  border: solid red 2px
} */

#title-bar {
  display: flex;
  justify-content: space-between;
  background-color: RGB(0, 45, 95);
  padding: 15px 35px 10px 55px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

#logo {
  /* border: solid red 2px; */
  display: flex;
  align-items: center;
  color: #e4e4e4;
  font-size: 1.5em;
}

#logo-image {
  width: 65px;
  margin-right: 20px;
}

.login img {
  height: 30px;
}

.login button {
  background: none;
  color: rgb(232, 232, 232);
  border: solid 1px rgb(232, 232, 232);
  border-radius: 5px ;
}

#app {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  display: flex;
  align-items: center;
}
#nav a {
  color: #eaeaea;
  text-decoration: none;
  font-weight: bold;
}
.topBarIcon {
  width: 35px;
  margin: 0 5px 0 15px;
}
input[type="image"]:focus {
  outline: none;
}
input {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
textarea {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  padding: 5px;
}
</style>
