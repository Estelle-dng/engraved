<template>
  <q-page padding>

    <h2>profile</h2>
    <p v-if="getUserData()">Salut {{ email }} ! </p>
    <div v-else class="text-center"><q-btn to="/auth" class="bg-red text-white">Log in now !</q-btn></div>
    <!-- content -->
  </q-page>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore();
const auth = getAuth();
const user = auth.currentUser;

export default {
  name: 'PageProfile',

  data(){
    return{
       email : '',
       posts : []
    }
  },
  methods: {
    getUserData(){
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.email = user.email;

          // Get posts
          /* const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
              console.log(`${doc.id} => ${doc.data()}`);
            }); */

          db.collection("posts").where("userId", "==", user.uid)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc.id, " => ", doc.data());
              });
          })
          .catch((error) => {
              console.log("Error getting documents: ", error);
          });

          return true;
        } else {
          // User is signed out
          return;
        }
      });
      if(onAuthStateChanged) return true;
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
