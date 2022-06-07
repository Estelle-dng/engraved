<template>
  <q-page class="constrain q-pa-md">
     <q-input
        v-model="search"
        class="q-mb-md"
        color="grey-10"
        label="Search a #, username, location..."
        type="search"
        :rules="[val=> !!val || 'Type something']"
        debounce="4000"
        @change="pressed()"
      >
        <template v-slot:append>
         <q-icon @click="pressed()" name="search"/>
        </template>
      </q-input>

    <q-infinite-scroll class="row">
      <template v-if="posts.length">
        <q-card
       v-for="post in posts"
       :key="post.id"
       class="card-post q-mb-md col-sm-12 col-xs-12 col-md-4"
       bordered
       flat
     >
      <q-img :src="post.imageUrl"/>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img v-if="post.userPhoto" :src="post.userPhoto"/>
            <img v-else src="icons/icon-128x128.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <router-link class="title" :to="{ name: 'Tattoist', params: { id : post.id} }">{{post.userName}}</router-link>
          <q-item-label caption>
            <q-icon v-if="post.location"
            name="eva-pin-outline"
            /> {{post.location}}
          </q-item-label>
        </q-item-section>
        <q-item-section class="items-end">
            <q-icon
            name="eva-plus-circle-outline"
            size="md"
            />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section class="row">
        {{post.caption}}
        <q-separator vertical inset />
        <q-item-label class="col text-right">
          <q-icon
          class="full-height"
          name="eva-calendar-outline"
          />
          {{post.date | formattedDate}}
        </q-item-label>
      </q-card-section>
      <q-card-section class="q-pt-0">
        <div class="row">
          <q-chip class="bg-grey-9 text-white" v-for="hashtag in post.hashtags" :key="hashtag"><span v-if="!hashtag"></span>{{hashtag}}</q-chip>
      </div>
      </q-card-section>
    </q-card>
      </template>
      <template v-else-if="!posts.length && search">
        <h5 class="m0-auto">There is no result for your research</h5>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { collection, query, where, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();
const posts = collection(db, "posts");
export default {
  name: 'PageSearch',
  data(){
    return{
      search: '',
      posts: [],
      search: '',
    }
  },
  methods:{
    async pressed(){
      this.$q.loading.show();
      try{
        this.posts = [];
        const q = query(posts, where("hashtags", "array-contains", this.search));
        const u = query(posts, where("userName", "==", this.search));
        const l = query(posts, where("location", ">=", this.search));
        const querySnapshot = await getDocs(q);
        const querySnapshotUsers = await getDocs(u);
        const querySnapshotLoc = await getDocs(l);
        querySnapshot.forEach((doc) => {
          this.posts.push(doc.data());
        });
        querySnapshotUsers.forEach((doc) => {
          this.posts.push(doc.data());
        });
        querySnapshotLoc.forEach((doc) => {
          this.posts.push(doc.data());
        });
        this.posts = this.getUniqueListBy(this.posts, 'id');
        this.$q.loading.hide();
      }
      catch(e){
        this.$q.loading.hide();
      }
    },
    getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
    }
  },
  filters: {
    formattedDate(value){
      return date.formatDate(value, 'D MMM YYYY');
    }
  },
}
</script>

<style lang="scss">
  .card-post{
    @media (min-width: $breakpoint-md-min) {
      width: 32% !important;
      margin: 0 auto 16px auto;
    }
    .q-img{
      min-height: 200px;
      max-height: 500px;
    }
    .title{
      font-weight: 700;
      text-decoration: none;
      color: black;
      }
    .q-pt-0{padding-top: 0 !important}
    .margin-y-auto{
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
  }
</style>
