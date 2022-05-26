<template>
  <q-page padding>

    <h2>profile</h2>
    <p v-if="getUserData()">Salut {{ email }} // {{ name }}! </p>
    <div v-else class="text-center"><q-btn to="/auth" class="bg-red text-white">Log in now !</q-btn></div>
    <!-- content -->

   <section v-if="posts.length" class="row">
        <q-card
       v-for="post in posts"
       :key="post.id"
       class="card-post q-mb-md col-sm-4 col-xs-4 col-md-4"
       bordered
       flat
      >
        <q-img :src="post.imageUrl"/>
       </q-card>
    </section>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();
const posts = collection(db, "posts");
const auth = getAuth();
export default {
  name: 'PageProfile',

  data(){
    return{
       email : '',
       name : '',
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
          console.log(auth.currentUser.uid);
          const userInfo = doc(db, "users", user.uid);
          const docSnap = getDoc(userInfo).then(res => {
            console.log("Document data:", res.data());
            let user = res.data();
            this.name = user.name;
          }).catch(err => {console.log('error : ', err);});

          return true;
        } else {
          // User is signed out
          return;
        }
      });
      if(onAuthStateChanged) return true;
    },
    async getPosts(){
    // Get posts
      const q = query(posts , where("userId", "==", getAuth().currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.posts.push(doc.data());
      });

    },
  },
  activated(){
    this.getUserData();
    this.getPosts();
  },
  created(){
    this.getUserData();
    this.getPosts();
  }
}
</script>
