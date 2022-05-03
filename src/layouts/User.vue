<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="bg-grey-10" elevated>
      <q-toolbar class="constrain">      
         <q-btn to="/" unelevated>
        <q-avatar class="col justify-start">
            <img src="../assets/logo-engraved-dark.png">
        </q-avatar>
        </q-btn>
        <q-separator class="large-screen-only" dark vertical inset />
        <q-toolbar-title class="title col text-center text-sm-left">
          Engraved
        </q-toolbar-title>
        <q-tabs>
          <q-route-tab
            to="/Camera"
            icon="eva-camera-outline"
            name="Camera"
          />
          <q-route-tab
            to="/Settings"
            icon="eva-settings-2-outline"
            name="Settings"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

        <q-page-container class="bg-grey-12">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

    <!-- (Optional) The Footer -->
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
  // name: 'LayoutName',

  data () {
    return {
      leftDrawer: true
    }
  }
}
</script>
