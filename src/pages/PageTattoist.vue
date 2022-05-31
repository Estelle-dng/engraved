<template>
  <q-page >
    <section class="row q-pa-0 ">
      <q-img v-if="banner" :src="banner" class="banner column col-12 text-right "/>
      <q-img v-else src="../assets/banner.jpg" class="banner column col-12 text-right "/>
    </section>
    <section class="q-pa-lg">
      <div class="row">
        <div class="user-info col slef-start">
          <p class="q-mb-xs font-weight-medium"> {{ name }}</p>
          <!-- <p>xxx folowers</p> -->
          <div class="row text-grey-7 col self-end">
            <q-icon v-if="location" name="eva-pin"/>
            <p class="q-ml-sm">{{ location }}</p>
          </div>

        </div>
        <!-- <q-btn label="Follow" color="red" class="col-2 follow"></q-btn> -->
      </div>
      <div class="row">
          <q-chip v-for="el in style" :key="el" class="bg-grey-9 text-white">{{el}}</q-chip>
      </div>
      <div class="bio q-pt-lg">
        <p class="q-mb-xs">Contact : {{contact}}</p>
        <p>Booking : <span v-if="booking">Open</span><span v-else>Closed</span></p>
        <p>{{bio}}</p>
      </div>
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
import { collection, query, where, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();
const posts = collection(db, "posts");
export default {
  name: 'PageProfile',

  data(){
    return{
       email : '',
       banner : '',
       name : '',
       posts : [],
       bio : '',
       contact: '',
       booking: true,
       location: '',
       style : [],
       selectedUid : 0,
    }
  },
  methods: {
    getUserData(selectedUid){
          const userInfo = doc(db, "users", selectedUid);
          getDoc(userInfo).then(res => {
            let user = res.data();
            this.name = user.name;
            this.bio = user.bio;
            this.contact = user.contact;
            this.style = user.style;
            this.location = user.location;
            this.banner = user.photo;
            this.booking = user.booking;
          }).catch(err => {console.log('error : ', err);});
          this.getPosts(selectedUid);
    },
    async getPosts(selectedUid){
        const q = query(posts , where("userId", "==", selectedUid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          this.posts.push(doc.data());
        });
    },
  },
  activated(){
    this.selectedUid = this.$route.params.id;
    this.getUserData(this.selectedUid);
    console.log(this.$route.params.id);
  },
  created(){
   this.selectedUid = this.$route.params.id;
    this.getUserData(this.selectedUid);
    console.log(this.$route.params);
  }
}
</script>

<style lang="scss" scoped>
  .banner{max-height: 300px;}
  .follow{max-height: 36px;}
</style>
