<template>
  <q-page class="constrain q-pa-md">
    <q-infinite-scroll class="row ">
     <q-card
       v-for="post in posts"
       :key="post.id"
       class="card-post q-mb-md col-sm-12 col-xs-12 col-md-4"
       bordered
       flat
     >
      <q-img :src="post.imgUrl"/>
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
    </q-infinite-scroll>

  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageHome',
  data(){
    return{
      posts: [
        {
          id : 1,
          date: 1656524034632,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Estelle',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords: ['black work', "animal", 'realist']
        },
        {
          id : 2,
          date: 1651524034935,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Bib',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords: ['black work', "animal", 'realist']
        },
        {
          id : 3,
          date: 1651524034935,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Boub',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords:['black work', "animal", 'realist']
        },
         {
          id : 4,
          date: 1651524034935,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Boub',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords:['black work', "animal", 'realist']
        },
         {
          id : 5,
          date: 1651524034935,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Boub',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords:['black work', "animal", 'realist']
        },
         {
          id : 6,
          date: 1651524034935,
          location : 'Bordeaux, France',
          imgUrl: 'https://cdn.quasar.dev/img/mountains.jpg',
          userName: 'Boub',
          userPicture: 'https://cdn.quasar.dev/img/boy-avatar.png',
          keyWords:['black work', "animal", 'realist']
        },
      ]
    }
  },
  filters: {
    formattedDate(value){
      return date.formatDate(value, 'D MMM YYYY');
    }
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