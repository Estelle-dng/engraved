<template>
  <q-page>
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
      <div class="row">
        <q-chip v-for="el in style" :key="el" class="bg-grey-9 text-white">{{
          el
        }}</q-chip>
      </div>
      <div class="bio q-pt-lg">
        <p v-if="contact" class="q-mb-xs">Contact : {{ contact }}</p>
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
      />
    </section>
  </q-page>
</template>

<script>
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
const db = getFirestore();
const posts = collection(db, "posts");
export default {
  name: "PageTattoist",
  components: {
    card: require("components/Card.vue").default,
  },
  data() {
    return {
      email: "",
      banner: "",
      name: "",
      posts: [],
      bio: "",
      contact: "",
      booking: true,
      location: "",
      style: [],
      selectedUid: 0,
    };
  },
  methods: {
    getUserData(selectedUid) {
      const userInfo = doc(db, "users", selectedUid);
      getDoc(userInfo)
        .then((res) => {
          let user = res.data();
          this.name = user.name;
          this.bio = user.bio;
          this.contact = user.contact;
          this.style = user.style;
          this.location = user.location;
          this.banner = user.photo;
          this.booking = user.booking;
        })
        .catch((err) => {
          this.$q.dialog({
            title: "Error",
            message: "Could not find user data",
          });
        });
      this.getPosts(selectedUid);
    },
    async getPosts(selectedUid) {
      const q = query(
        posts,
        where("userId", "==", selectedUid),
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
  activated() {
    this.selectedUid = this.$route.params.id;
    this.getUserData(this.selectedUid);
  },
  created() {
    this.selectedUid = this.$route.params.id;
    this.getUserData(this.selectedUid);
  },
};
</script>

<style lang="scss" scoped>
.font-weight-medium {
  font-weight: 700;
}
.banner {
  max-height: 300px;
}
.follow {
  max-height: 36px;
}
.card-img {
  height: 300px !important;
  .q-img {
    height: 100% !important;
    object-fit: cover;
  }
}
</style>
