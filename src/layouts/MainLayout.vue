<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-10 row constain">
        <q-btn to="/" unelevated>
        <q-avatar class="col justify-start">
            <img src="../assets/logo-engraved-dark.png">
        </q-avatar>
        </q-btn>
        <q-separator class="large-screen-only" dark vertical inset />
        <q-toolbar-title class="title col text-center text-sm-left">
          Engraved
        </q-toolbar-title>
        <q-tabs class="col-2">
          <q-route-tab
            class="justify-end"
            to="/Settings"
            icon="eva-settings-2-outline"
            name="Settings"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="small-screen-only" elevated>
      <q-tabs 
      class="bg-grey-10 text-white shadow-2"
      active-color="red-9"
      >
        <q-route-tab
          to="/"
          icon="eva-home-outline"
          name="Home"
        />
        <q-route-tab
          to="/Search"
          icon="eva-search-outline"
          name="Search"
          />
        <q-route-tab
          to="/Notifications"
          icon="eva-bell-outline"
          name="Notifications"
        />
        <q-route-tab
          to="/Profile"
          icon="eva-person-outline"
          name="Profile"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
    
    }
  }
}
</script>

<style lang="scss">
.q-avatar .q-avatar__content{
  justify-content: start;
}
</style>