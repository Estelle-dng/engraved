<template>
  <q-page class="constrain q-pa-md">
    <q-infinite-scroll class="row ">
      <template v-if="!loadingPosts && posts.length">
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
            <img :src="post.userPicture">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="title">{{post.userName}}</q-item-label>
          <q-item-label caption>
            <q-icon 
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
          <q-chip 
          v-for="word in post.keyWords"
          :key="word"
          >{{word}}</q-chip>
          <q-separator class="small-screen-only" vertical inset />
          <q-item-label class="col text-right small-screen-only">  
            <q-icon 
            class="full-height"
            name="eva-calendar-outline"
            />
            {{post.date | formattedDate}}
          </q-item-label>
      </q-card-section>
      <q-card-section class="large-screen-only">
        <q-separator />
        <q-item-label class="q-pt-md">  
            <q-icon
            name="eva-calendar-outline "
            />
            {{post.date | formattedDate}}
          </q-item-label>
      </q-card-section>
    </q-card>
      </template>
      <template v-else-if="!loadingPosts && !posts.length">
        <h5 class="m0-auto" >No posts yet</h5>
      </template>
      <template v-else-if="loadingPosts && posts.length">
        <q-card 
        class=" card-post col-sm-12 col-xs-12 col-md-4" 
        flat 
        bordered
        >
          <q-item>
            <q-item-section avatar>
              <q-skeleton type="QAvatar" animation="fade" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" animation="fade" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" animation="fade" />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-skeleton height="200px" square animation="fade" />

          <q-card-section>
            <q-skeleton type="text" class="text-subtitle2" animation="fade" />
            <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
          </q-card-section>
        </q-card>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageHome',
  data(){
    return{
      posts: [],
      loadingPosts: false,
    }
  },
  methods:{
    getPosts(){
      this.loadingPosts = true;
      this.$axios.get(`${process.env.API}/posts`).then(response => {
        this.posts = response.data;
        this.loadingPosts = false;
      }).catch(err => {
        console.log('error : ' , err);
        this.$q.dialog({
          title: 'Error',
          message: 'Could not find posts'
        });
        this.loadingPosts = false;
      });
    }
  },
  filters: {
    formattedDate(value){
      return date.formatDate(value, 'D MMM YYYY');
    }
  },
  created(){
    this.getPosts();
  }
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
  }
</style>