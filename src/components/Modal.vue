<template>
  <div class="modale flex flex-center">
    <q-card class="card">
      <q-img :src="modalData.imageUrl" />
      <q-card-section>
        <div class="row no-wrap items-center q-px-lg">
          <div class="text-h6 ellipsis col">
            {{ modalData.userName }}
          </div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            {{ modalData.location }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div>
          {{ modalData.caption }}
        </div>
        <div class="row">
          <q-chip
            class="bg-grey-9 text-white"
            v-for="hashtag in modalData.hashtags"
            :key="hashtag"
            ><span v-if="!hashtag"></span>{{ hashtag }}</q-chip
          >
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat color="grey-10" label="Close" @click="$emit('close')" />
        <q-btn
          v-if="profilePage"
          v-close-popup
          flat
          color="red"
          label="Delete"
          @click="confirm = true"
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            icon="eva-alert-circle-outline"
            color="red"
            text-color="white"
          />
          <span class="q-ml-sm">Are you sure to delete this post ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-10" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="red"
            v-close-popup
            @click="
              deletePost();
              $emit('close');
              $emit('delete');
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
const db = getFirestore();
export default {
  name: "Modal",
  props: ["modalData"],
  data() {
    return {
      confirm: false,
      profilePage: false,
    };
  },
  methods: {
    async deletePost() {
      let id = this.modalData.id;
      await deleteDoc(doc(db, "posts", id));
      this.$q.notify({
        message: "Post Deleted",
        actions: [{ label: "Dismiss", color: "white" }],
      });
    },
    checkUrl() {
      const currentUrl = window.location.href.indexOf("profile");
      if (currentUrl != -1) {
        this.profilePage = true;
      }
    },
  },
  created() {
    this.checkUrl();
  },
};
</script>

<style lang="scss">
.modale {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  max-height: 100vh;
  max-width: 100vw;
  background-color: rgba($color: #000000, $alpha: 0.7);
}
.card {
  width: 70vw;
  height: 80vh;
  object-fit: contain;
  .q-img {
    height: 70% !important;
  }
}
</style>
