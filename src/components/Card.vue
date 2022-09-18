<template>
  <q-card :class="{ 'bg-red-2': post.offline }" bordered flat>
    <q-badge
      v-if="post.offline"
      class="q-ma-sm absolute-top-right badge-offline"
      color="red"
    >
      Offline post
    </q-badge>
    <q-img :src="post.imageUrl" @click="openModal(post)" />
    <router-link
      class="link"
      :to="{ name: 'Tattoist', params: { id: post.userId } }"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              class="user-photo"
              v-if="post.userPhoto"
              :src="post.userPhoto"
            />
            <img v-else src="icons/icon-128x128.png" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <p class="title">
            {{ post.userName }}
          </p>
          <q-item-label caption>
            <q-icon v-if="post.location" name="eva-pin-outline" />
            {{ post.location }}
          </q-item-label>
        </q-item-section>
        <!--  <q-item-section class="items-end">
              <q-icon
              name="eva-plus-circle-outline"
              size="md"
              />
          </q-item-section> -->
      </q-item>
    </router-link>
    <q-separator />
    <q-card-section class="row text-black">
      {{ post.caption }}
      <q-separator vertical inset />
      <q-item-label class="col text-right">
        <q-icon class="full-height" name="eva-calendar-outline" />
        {{ post.date | formattedDate }}
      </q-item-label>
    </q-card-section>
    <q-card-section class="q-pt-0">
      <div class="row">
        <q-chip
          class="bg-grey-9 text-white"
          v-for="hashtag in post.hashtags"
          :key="hashtag"
          ><span v-if="!hashtag"></span>{{ hashtag }}</q-chip
        >
      </div>
    </q-card-section>
    <modal
      v-if="modalVisible"
      @close="hideModal()"
      @delete="$emit('delete')"
      :modalData="this.modalData"
    />
  </q-card>
</template>

<script>
import { date } from "quasar";
export default {
  name: "Card",
  props: ["data"],
  components: {
    modal: require("components/Modal.vue").default,
  },
  data() {
    return {
      post: this.data,
      modalVisible: false,
      modalData: null,
    };
  },
  methods: {
    openModal(data) {
      this.modalData = data;
      this.modalVisible = true;
    },
    hideModal() {
      this.modalVisible = false;
    },
  },
  filters: {
    formattedDate(value) {
      return date.formatDate(value, "D MMM YYYY");
    },
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
  color: black;
}

.q-img {
  height: 300px;
  object-fit: cover;
}
</style>
