<template>
  <q-page padding>
    <h2>profile</h2>
    <p>Salut {{ email }} ! </p>
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
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
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
