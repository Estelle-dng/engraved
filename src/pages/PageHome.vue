<template>

  <q-page class="constrain q-pa-md">
    <!-- Notification banner -->
    <div
      v-if="showNotificationsBanner && pushNotificationsSupported"
      class="q-ma-sm">
        <q-banner
        dense
        inline-actions
        class="bg-grey-10 text-white constrain"
        >
          <template v-slot:avatar>
            <q-avatar
            text-color="grey-10 bg-red"
            icon="eva-bell-outline"
            font-size="22px"
            />
          </template>
            Enable notifications ?
          <template v-slot:action>
           <q-btn
              @click="enableNotifications()"
              class="q-px-sm"
              label="Yes"
              dense
              flat
            />
            <q-btn
            @click="showNotificationsBanner = false"
              class="q-px-sm"
              label="Later"
              dense
              flat
            />
            <q-btn
              @click="neverShowNotificationsBanner()"
              class="q-px-sm"
              label="Never"
              dense
              flat
            />
          </template>
        </q-banner>
    </div>

    <q-infinite-scroll class="row ">
      <template v-if="!loadingPosts && posts.length">
        <q-card
       v-for="post in posts"
       :key="post.id"
       class="card-post q-mb-md col-sm-12 col-xs-12 col-md-4"
       :class="{'bg-red-2' : post.offline}"
       bordered
       flat
     >
     <router-link class="link" :to="{ name: 'Tattoist', params: { id : post.userId} }">
      <q-badge
        v-if="post.offline"
        class="q-ma-sm absolute-top-right badge-offline"
        color="red"
      >
      Offline post
     </q-badge>
      <q-img :src="post.imageUrl"/>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img v-if="post.userPhoto" :src="post.userPhoto"/>
            <img v-else src="icons/icon-128x128.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <router-link class="title" :to="{ name: 'Tattoist', params: { id : post.userId} }">{{post.userName}}</router-link>
          <q-item-label caption>
            <q-icon v-if="post.location"
            name="eva-pin-outline"
            /> {{post.location}}
          </q-item-label>
        </q-item-section>
       <!--  <q-item-section class="items-end">
            <q-icon
            name="eva-plus-circle-outline"
            size="md"
            />
        </q-item-section> -->
      </q-item>
      <q-separator />
      <q-card-section class="row text-black">
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
      </router-link>
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
import { date } from 'quasar';
import { openDB } from 'idb';
import { collection, query, getDocs, getFirestore, orderBy } from "firebase/firestore";
let qs = require('qs');
const db = getFirestore();
const posts = collection(db, "posts");
export default {
  name: 'PageHome',
  data(){
    return{
      posts: [],
      loadingPosts: false,
      showNotificationsBanner : false,
    }
  },
  computed: {
    serviceWorkerSupported(){
      if ('serviceWorker' in navigator) return true;
      return false;
    },
    pushNotificationsSupported(){
      if ('PushManager' in window) return true;
      return false;
    }
  },
  methods:{
    async getPosts(){
      this.$q.loading.show();
      this.loadingPosts = true;
      try{
        const q = query(posts, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        this.posts = [];
        querySnapshot.forEach((doc) => {
          this.posts.push(doc.data());
        });
        if(!navigator.onLine){this.getOfflinePosts();}
        this.loadingPosts = false;
        this.$q.loading.hide();
      }
      catch(err) {
        if(navigator.onLine){
          this.$q.dialog({
          title: 'Error',
          message: 'Could not find posts',
        });
          this.loadingPosts = false;
          this.$q.loading.hide();
        }
      };
    },
    getOfflinePosts() {
      openDB('workbox-background-sync').then(db => {
        db.getAll('requests').then(failedRequests => {
          failedRequests.forEach(failedRequest => {
            if (failedRequest.queueName == 'createPostQueue') {

              let request = new Request(failedRequest.requestData.url, failedRequest.requestData);

              request.formData().then(formData => {
                let offlinePost = {};
                offlinePost.id = formData.get('id');
                offlinePost.caption = formData.get('caption');
                offlinePost.location = formData.get('location');
                offlinePost.date = parseInt(formData.get('date'));
                offlinePost.offline = true;
                offlinePost.imageUrl = '';
                let reader = new FileReader()
                reader.readAsDataURL(formData.get('file'))
                reader.onloadend = () => {
                  offlinePost.imageUrl = reader.result;
                  this.posts.unshift(offlinePost);
                }
              });
            }
          })
        }).catch(err => {
          console.log('Error accessing IndexedDB: ', err)
        })
      })
    },
    listenForOfflinePost() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', event => {
          if (event.data.message == 'offline-post-uploaded') {
            let offlinePostCount = this.posts.filter(post => post.offline == true).length;
            this.posts[offlinePostCount - 1].offline = false;
          }
        });
      }
    },
    initNotificationsBanner(){
      let neverShowNotificationsBanner = this.$q.localStorage.getItem('neverShowNotificationsBanner');

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true;
      }
    },
    enableNotifications() {
      if(this.pushNotificationsSupported){
        Notification.requestPermission(result => {
          this.neverShowNotificationsBanner();
          if(result == 'granted'){
            //this.displayGrantedNotifications();
            this.checkForExistingPushSubscription();
          }
        });
      }
    },
    checkForExistingPushSubscription(){
      if(this.serviceWorkerSupported && this.pushNotificationsSupported){
        let reg;
        navigator.serviceWorker.ready.then(swreg => {
          reg = swreg;
          swreg.pushManager.getSubscription()
        }).then(sub => {
          if(!sub){
            //Create a new subscription
            this.createPushSubscription(reg);
          }
        });
      };
    },
    createPushSubscription(registration){
      let vapidPublicKey = 'BK9haeBXyHenav_5-1gTT-e7rAwvSFwEWSIAIe1EJrLUKfzfiTA3vGNf5n1yuhIA_5qQq8ySZL3qVDtL91eso-s';
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      }).then(newSub => {
        let newSubData = newSub.toJSON();
        let newSubDataQS = qs.stringify(newSubData);
        return this.$axios.post(`${process.env.API}/createSubscription?${newSubDataQS}`)
      }).then(response => {
        this.displayGrantedNotifications();
      }).catch(err => {
        console.log(err);
      });

    },
    displayGrantedNotifications(){
      if(this.serviceWorkerSupported && this.pushNotificationsSupported){
        navigator.serviceWorker.ready.then(swreg => {
          swreg.showNotification('You are now subscribed to notifications !', {
            body: 'Thanks for subscribing',
            icon: 'icons/icon-128x128.png',
            image: 'icons/icon-128x128.png',
            badge: 'icons/icon-128x128.png',
            lang: 'en-US',
            vibrate: [100, 50, 200],
            /* actions: [
              {
                action : 'hello',
                title : 'hello',
                icon : 'icons/icon-128x128.png'
              } ,
            ]*/
          });
        });
      }
    },
    neverShowNotificationsBanner() {
      this.showNotificationsBanner = false
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    },
  },
  filters: {
    formattedDate(value){
      return date.formatDate(value, 'D MMM YYYY');
    }
  },
  activated() {
    this.getPosts();
    this.initNotificationsBanner();
  },
  created(){
    this.listenForOfflinePost();
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
      height: 300px;
      min-height: 200px;
      max-height: 500px;
    }
    .badge-offline{
      z-index: 1;
      height: 10px;
    }
    .title{
      font-weight: 700;
      text-decoration: none;
      color: black;
      }
    .q-pt-0{padding-top: 0 !important}
    .link{text-decoration: none;}
  }
</style>
