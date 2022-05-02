<template>
  <q-page class="constrain q-pa-md">

     <q-card class="card-post" flat bordered>
      <q-img src="https://cdn.quasar.dev/img/mountains.jpg"/>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="title">Username</q-item-label>
          <q-item-label caption>
            <q-icon 
            name="eva-pin-outline"
            /> Location
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
          <q-chip>Key word</q-chip>
          <q-chip>Key word</q-chip>
          <q-chip>Key word</q-chip>
          <q-separator vertical inset />
          <q-item-label class="col text-right">  
            <q-icon 
            class="h-100"
            name="eva-calendar-outline"
            />
            2 days ago
          </q-item-label>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
export default {
  name: 'PageHome'
}
</script>

<style lang="scss">
  .card-post{
    .q-img{
      min-height: 200px;
      max-height: 500px;
      }
  }
</style>