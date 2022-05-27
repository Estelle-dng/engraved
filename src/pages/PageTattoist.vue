<template>
  <q-page >
    <section class="row q-pa-0 ">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="banner column col-12 text-right ">
        <q-btn
          class="bg-grey-10 text-white q-mt-md q-mr-md"
          icon="eva-edit-outline"
          size="md"
          to="/edit"
          round
        />
      </q-img>
    </section>
    <section class="q-pa-lg" v-if="getUserData()">
      <div class="row">
        <div class="user-info col slef-start">
          <p class="q-mb-xs">{{ email }} // {{ name }}</p>
          <p>xxx folowers</p>
          <div class="row text-grey-7 col self-end">
            <q-icon name="eva-pin"/>
            <p class="q-ml-sm">Bordeaux, 33000 France</p>
          </div>

        </div>
        <q-btn label="Follow" color="red" class="col-2 follow"></q-btn>
      </div>
      <div class="row">
          <q-chip  class="bg-grey-9 text-white">realist</q-chip>
          <q-chip  class="bg-grey-9 text-white">black work</q-chip>
          <q-chip class="bg-grey-9 text-white">animal</q-chip>
      </div>
      <div class="bio q-pt-lg">
        <p class="q-mb-xs">Contact : estelle.denage@gmail.com</p>
        <p>Booking : Open</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis minima autem at quas aperiam eos rem enim officia architecto? Labore laboriosam repellendus in molestiae odit possimus iusto, nobis numquam eius.</p>
      </div>
    </section>
    <section v-else class="text-center">
      <q-btn to="/auth" class="bg-red text-white">Log in now !</q-btn>
    </section>
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
        if (user.uid) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.email = user.email;
          const userInfo = doc(db, "users", user.uid);
          const docSnap = getDoc(userInfo).then(res => {
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

<style lang="scss" scoped>
  .banner{max-height: 300px;}
  .follow{max-height: 36px;}
</style>
