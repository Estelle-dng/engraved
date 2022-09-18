<template>
  <q-page v-if="tattoist">
    <section class="row q-pa-0">
      <q-img
        v-if="banner"
        :src="banner"
        class="banner column col-12 text-right"
      />
      <q-img
        v-else
        src="../assets/banner.jpg"
        class="banner column col-12 text-right"
      />
    </section>
    <section class="q-pa-lg">
      <div class="row">
        <div class="user-info col slef-start">
          <p class="q-mb-xs font-weight-medium">{{ name }}</p>
          <!-- <p>xxx folowers</p> -->
          <div v-if="location" class="row text-grey-7 col self-end">
            <q-icon name="eva-pin" />
            <p class="q-ml-sm">{{ location }}</p>
          </div>
        </div>
        <!-- <q-btn label="Follow" color="red" class="col-2 follow"></q-btn> -->
      </div>
      <div class="row" v-if="style">
        <q-chip v-for="el in style" :key="el" class="bg-grey-9 text-white">{{
          el
        }}</q-chip>
      </div>
      <div class="bio q-pt-lg">
        <p class="q-mb-xs">Contact : {{ contact }}</p>
        <p>
          Booking : <span v-if="booking">Open</span><span v-else>Closed</span>
        </p>
        <p>{{ bio }}</p>
      </div>
    </section>
    <section v-if="posts.length" class="row">
      <card
        class="card-post q-mb-md col-sm-12 col-xs-12 col-md-4"
        v-for="post in posts"
        :key="post.id"
        :data="post"
        @delete="
          posts = [];
          getPosts();
        "
      />
    </section>
  </q-page>

  <q-page class="q-pa-md" v-else>
    <div class="row h-100 q-pa-md">
      <div class="user-pp">
        <q-img v-if="banner" :src="banner" class="" />
        <q-img v-else src="../assets/banner.jpg" class="" />
      </div>
      <div class="justify-center q-ml-md column">
        <p class="q-mb-xs font-weight-medium">{{ name }}</p>
      </div>
    </div>
    <div class="q-pa-lg">
      <div class="bio">
        <h6 class="q-ma-0">Bio :</h6>
        <p>{{ bio }}</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import Card from "components/Card.vue";
const db = getFirestore();
const posts = collection(db, "posts");
const auth = getAuth();
const user = auth.currentUser;
export default {
  name: "PageProfile",
  components: {
    card: require("components/Card.vue").default,
  },
  data() {
    return {
      uid: "",
      email: "",
      banner: "",
      name: "",
      posts: [],
      bio: "",
      contact: "",
      booking: true,
      location: "",
      style: [],
      tattoist: false,
    };
  },
  methods: {
    async getUserData() {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.uid = user.uid;
          this.email = user.email;
          const userInfo = doc(db, "users", user.uid);
          getDoc(userInfo)
            .then((res) => {
              let getUser = res.data();
              this.name = getUser.name;
              this.bio = getUser.bio;
              this.contact = getUser.contact;
              this.style = getUser.style;
              this.location = getUser.location;
              this.banner = getUser.photo;
              this.booking = getUser.booking;
              this.tattoist = getUser.tattoist;
            })
            .catch((err) => {
              console.log("error : ", err);
              this.$q.dialog({
                title: "Error",
                message: "Could not find user data",
              });
            });
          this.getPosts();
        } else {
          this.$router.push("/auth");
        }
      });
    },
    async getPosts() {
      const q = query(
        posts,
        where("userId", "==", getAuth().currentUser.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      try {
        querySnapshot.forEach((doc) => {
          this.posts.push(doc.data());
        });
      } catch {
        this.$q.dialog({
          title: "Error",
          message: "Could not find posts",
        });
      }
    },
  },
  async activated() {
    await this.getUserData();
  },
  async created() {
    await this.getUserData();
  },
};
</script>

<style lang="scss" scoped>
.h-100 {
  height: 100%;
}
.user-pp {
  border-radius: 5rem;
  width: 50px;
  height: 50px;
  object-fit: cover;
  overflow: hidden;
  .q-img {
    height: 100%;
  }
}
.q-ma-0 {
  margin: 0 !important;
}
.font-weight-medium {
  font-weight: 600;
}
.banner {
  max-height: 300px;
}
.follow {
  max-height: 36px;
}
.card-img {
  height: 300px !important;
  object-fit: cover;
}
</style>
