<template>
  <q-page class="constrain q-pa-md">
    <notif />

    <q-infinite-scroll class="row">
      <template v-if="!loadingPosts && posts.length">
        <card
          class="card-post q-mb-md col-sm-12 col-xs-12 col-md-4"
          v-for="post in posts"
          :key="post.id"
          :data="post"
        />
      </template>

      <template v-else-if="!loadingPosts && !posts.length">
        <h5 class="m0-auto">No posts yet</h5>
      </template>

      <template v-else-if="loadingPosts && posts.length">
        <q-card class="card-post col-sm-12 col-xs-12 col-md-4" flat bordered>
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
            <q-skeleton
              type="text"
              width="50%"
              class="text-subtitle2"
              animation="fade"
            />
          </q-card-section>
        </q-card>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import { openDB } from "idb";
import {
  collection,
  query,
  getDocs,
  getFirestore,
  orderBy,
} from "firebase/firestore";
let qs = require("qs");
const db = getFirestore();
const posts = collection(db, "posts");
export default {
  name: "PageHome",
  components: {
    card: require("components/Card.vue").default,
    notif: require("components/Notif.vue").default,
  },
  data() {
    return {
      posts: [],
      loadingPosts: false,
    };
  },
  computed: {
    serviceWorkerSupported() {
      if ("serviceWorker" in navigator) return true;
      return false;
    },
  },
  methods: {
    async getPosts() {
      this.$q.loading.show();
      this.loadingPosts = true;
      try {
        const q = query(posts, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        this.posts = [];
        querySnapshot.forEach((doc) => {
          this.posts.push(doc.data());
        });
        if (!navigator.onLine) {
          this.getOfflinePosts();
        }
        this.loadingPosts = false;
        this.$q.loading.hide();
      } catch (err) {
        if (navigator.onLine) {
          this.$q.dialog({
            title: "Error",
            message: "Could not find posts",
          });
          this.loadingPosts = false;
          this.$q.loading.hide();
        }
      }
    },
    getOfflinePosts() {
      openDB("workbox-background-sync").then((db) => {
        db.getAll("requests")
          .then((failedRequests) => {
            failedRequests.forEach((failedRequest) => {
              if (failedRequest.queueName == "createPostQueue") {
                let request = new Request(
                  failedRequest.requestData.url,
                  failedRequest.requestData
                );

                request.formData().then((formData) => {
                  let offlinePost = {};
                  offlinePost.id = formData.get("id");
                  offlinePost.caption = formData.get("caption");
                  offlinePost.location = formData.get("location");
                  offlinePost.date = parseInt(formData.get("date"));
                  offlinePost.offline = true;
                  offlinePost.imageUrl = "";
                  let reader = new FileReader();
                  reader.readAsDataURL(formData.get("file"));
                  reader.onloadend = () => {
                    offlinePost.imageUrl = reader.result;
                    this.posts.unshift(offlinePost);
                  };
                });
              }
            });
          })
          .catch((err) => {
            console.log("Error accessing IndexedDB: ", err);
          });
      });
    },
    listenForOfflinePost() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel("sw-messages");
        channel.addEventListener("message", (event) => {
          if (event.data.message == "offline-post-uploaded") {
            let offlinePostCount = this.posts.filter(
              (post) => post.offline == true
            ).length;
            this.posts[offlinePostCount - 1].offline = false;
          }
        });
      }
    },
    initNotificationsBanner() {
      let neverShowNotificationsBanner = this.$q.localStorage.getItem(
        "neverShowNotificationsBanner"
      );

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true;
      }
    },
  },
  activated() {
    this.getPosts();
  },
  created() {
    this.listenForOfflinePost();
  },
};
</script>

<style lang="scss">
.card-post {
  @media (min-width: $breakpoint-md-min) {
    width: 32% !important;
    margin: 0 auto 16px auto;
  }
  .user-photo {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .q-img {
    height: 300px;
    min-height: 200px;
    max-height: 500px;
  }
  .badge-offline {
    z-index: 1;
    height: 10px;
  }
  .title {
    font-weight: 700;
    text-decoration: none;
    color: black;
  }
  .q-pt-0 {
    padding-top: 0 !important;
  }
  .link {
    text-decoration: none;
  }
}
</style>
