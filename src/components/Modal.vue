<template>
  <div class="modale flex flex-center">
      <q-card class="card">
        <q-img :src="data.imageUrl" />
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{data.userName}}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="place" />
              {{data.location}}
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>
            {{data.caption}}
          </div>
          <div class="row">
            <q-chip class="bg-grey-9 text-white" v-for="hashtag in data.hashtags" :key="hashtag"><span v-if="!hashtag"></span>{{hashtag}}</q-chip>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup flat color="grey-10" label="Close" @click="$emit('close')"/>
          <q-btn v-close-popup flat color="red" label="Delete" @click="confirm = true" v-if="profilePage"/>
        </q-card-actions>
      </q-card>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="eva-delete" color="red" text-color="white"/>
            <span class="q-ml-sm">Are you sure to delete this post ?</span>
          </q-card-section>

          <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-10" v-close-popup/>
          <q-btn flat label="Delete" color="red" v-close-popup @click="deletePost(); $emit('close')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ['data'],
  data (){
    return {
      confirm: false,
      profilePage: false,
    }
  },
  methods: {
    deletePost(){
        console.log('delete post');
        this.$q.notify({
            message: 'Post Deleted',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
        });
    },
    checkUrl(){
      const currentUrl = window.location.href.indexOf("profile");
      if(currentUrl != -1){
        this.profilePage = true;
      }
    }
  },
  created(){
    this.checkUrl();
  }
}
</script>

<style lang="scss">
.modale{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  max-height: 100vh;
  max-width: 100vw;
  background-color: rgba($color: #000000, $alpha: 0.7);
  .card{width: 70vw;}
}
</style>
