<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10" elevated>
      <q-toolbar class="row constrain">
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

    <q-page-container class="bg-grey-12">
      <router-view />
    </q-page-container>

    <q-footer elevated>

      <div 
      v-if="showAppInstallBanner"
      class="bg-red">
        <q-banner 
        inline-actions 
        dense
        class="bg-red text-white constrain"
        >
          <template v-slot:avatar>
            <q-avatar 
            text-color="grey-10"
            icon="eva-download-outline"
            font-size="22px"
            />
          </template>
            Install Engraved ?
          <template v-slot:action>
           <q-btn
              @click="installApp()"
              class="q-px-sm"
              label="Yes"
              dense
              flat
            />
            <q-btn
            @click="showAppInstallBanner = false"
              class="q-px-sm"
              label="Later"
              dense
              flat
            />
            <q-btn
              @click="neverShowAppInstallBanner()"
              class="q-px-sm"
              label="Never"
              dense
              flat
            />
          </template>
        </q-banner>
      </div>

      <q-tabs
      class="small-screen-only bg-grey-10 text-white shadow-2"
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
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

export default {
  name: 'MainLayout',
  data () {
    return {
      showAppInstallBanner : false,
    }
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.neverShowAppInstallBanner()
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('neverShowAppInstallBanner', true)
    }
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem('neverShowAppInstallBanner')

    if (!neverShowAppInstallBanner) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        console.log(`'beforeinstallprompt' event was fired.`);
        setTimeout(() => {
          this.showAppInstallBanner = true
        }, 3000);
      });    
    }
  },
}
</script>

<style lang="scss">
.q-avatar .q-avatar__content{
  justify-content: start;
}
</style>