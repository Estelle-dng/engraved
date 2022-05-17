<template>
  <q-page padding>
    <h2>profile</h2>
    <q-btn @click="getUserData()">oui</q-btn>
    <p>Salut {{ email }} ! </p>
    <!-- content -->
  </q-page>
</template>

<script>
import { getAuth } from "firebase/auth";

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
      console.log(user);
      if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        this.email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        console.log('user');
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
      }
    }
  },
  activated(){
    this.getUserData();
  },
  created(){
    this.getUserData();
  }
}
</script>
