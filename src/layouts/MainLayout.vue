<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10" elevated>
      <!-- //header navigation -->
      <q-toolbar class="row constrain">
        <q-btn to="/"
        unelevated
        >
          <q-avatar class="col justify-start">
              <img src="../assets/logo-engraved-dark.png">
          </q-avatar>
        </q-btn>
        <q-separator class="large-screen-only" dark vertical inset />
        <q-toolbar-title class="title col text-center text-sm-left">
          Engraved
        </q-toolbar-title>
       <q-tabs
       class="small-screen-only"
       >
        <q-route-tab
          v-if="userIsTattoist"
          class="justify-end"
          to="/camera"
          icon="eva-camera-outline"
          name="Camera"
        />
        <q-route-tab
          v-if="!logged"
            v-ripple
            name="Login"
            to="/auth"
            clickable
            icon="eva-log-in-outline"
        />
        <q-route-tab
          v-if="logged"
          v-ripple
          name="Logout"
          to="/"
          clickable
          @click="logout()"
          icon="eva-log-out-outline"
        />
        </q-tabs>

        <q-btn
          @click="drawer = !drawer"
          class="large-screen-only"
          icon="menu"
          dense
          flat
          round
        />
      </q-toolbar>
      <!-- //Header navigation -->
    </q-header>

    <q-drawer
        v-model="drawer"
        :width="200"
        :breakpoint="500"
        side='right'
        overlay
        elevated
        content-class="bg-grey-3 large-screen-only"
      >
        <q-scroll-area class="fit">
          <q-list>
            <!-- //Drawer -->
            <template>
              <q-item
                v-ripple
                name="Home"
                to="/"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-home-outline" />
                </q-item-section>
                <q-item-section>
                  Home
                </q-item-section>
              </q-item>

              <q-separator/>

              <q-item
                v-ripple
                name="Search"
                to="/search"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-search-outline" />
                </q-item-section>
                <q-item-section>
                  Search
                </q-item-section>
              </q-item>

              <q-separator/>

              <q-item
                v-ripple
                name="Profile"
                to="/profile"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-person-outline" />
                </q-item-section>
                <q-item-section>
                  Profile
                </q-item-section>
              </q-item>

               <q-separator/>

              <q-item
                v-ripple
                name="Settings"
                to="/settings"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-settings-2-outline" />
                </q-item-section>
                <q-item-section>
                  Settings
                </q-item-section>
              </q-item>

               <q-separator/>

              <q-item
                v-if="userIsTattoist"
                v-ripple
                name="Camera"
                to="/camera"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-camera-outline" />
                </q-item-section>
                <q-item-section>
                  Add post
                </q-item-section>
              </q-item>
              <q-separator />

               <q-separator/>

              <q-item
              v-if="!logged"
                v-ripple
                name="Login"
                to="/auth"
                clickable
                active-class="red-9"
              >
                <q-item-section avatar>
                  <q-icon name="eva-log-in-outline" />
                </q-item-section>
                <q-item-section>
                  Login / Register
                </q-item-section>
              </q-item>

              <q-item
                v-if="logged"
                v-ripple
                name="Logout"
                to="/"
                clickable
                active-class="red-9"
                @click="logout()"
              >
                <q-item-section avatar>
                  <q-icon name="eva-log-out-outline" />
                </q-item-section>
                <q-item-section>
                  Logout
                </q-item-section>
              </q-item>

            </template>
            <!-- //Drawer -->
          </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-12">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>

    <q-footer elevated>
      <!-- // Install banner -->
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

      <!-- // Phone navigation -->
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
          to="/search"
          icon="eva-search-outline"
          name="Search"
          />
        <q-route-tab
          to="/profile"
          icon="eva-person-outline"
          name="Profile"
        />
        <q-route-tab
          to="/settings"
          icon="eva-settings"
          name="Settings"
        />
      </q-tabs>
      <!-- // Phone navigation -->
    </q-footer>
  </q-layout>
</template>

<script>
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();
export default {
  name: 'MainLayout',
  data () {
    return {
      showAppInstallBanner : false,
      userIsTattoist : false,
      drawer: false,
      logged : false
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
          this.neverShowAppInstallBanner()
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('neverShowAppInstallBanner', true)
    },
    logout() {
      auth.signOut()
      this.$router.push('/home')
        .then(() => {
        this.$q.notify({message: 'Sign Out Success.'})
      })
      .catch(error =>  console.log('error',error))
    },
    isUserLoggedIn() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.logged = true;
          const userInfo = doc(db, "users", user.uid);
          getDoc(userInfo).then(res => {
            let user = res.data();
            this.userIsTattoist = user.tattoist;
          }).catch(err => {console.log('error : ', err);});
        } else {
          this.logged = false;
        }
      });
    },
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
        setTimeout(() => {
          this.showAppInstallBanner = true
        }, 3000);
      });
    }
  },
  activated() {
    this.isUserLoggedIn();
  },
  created(){
    this.isUserLoggedIn();
  }
}
</script>

<style lang="scss" scoped>
  .red-9{color:#f16258;}
</style>
