<template>
  <q-page padding>

    <h2>profile</h2>
    <p v-if="getUserData()">Salut {{ email }} ! </p>
    <div v-else class="text-center"><q-btn to="/auth" class="bg-red text-white">Log in now !</q-btn></div>
    <!-- content -->
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
const user = auth.currentUser;
export default {
  name: 'PageProfile',

  data(){
    return{
       email : '',
    }
  },
  methods: {
    getUserData(){
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.email = user.email;
          return true;
        } else {
          // User is signed out
          return;
        }
      });
      if(onAuthStateChanged) return true;
      return false;
    },
  },
  activated(){
    this.getUserData();
  },
  created(){
    this.getUserData();
  }
}
</script>
