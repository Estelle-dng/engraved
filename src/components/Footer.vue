<template>
  <q-footer elevated>
    <div v-if="showAppInstallBanner" class="bg-red">
      <q-banner inline-actions dense class="bg-red text-white constrain">
        <template v-slot:avatar>
          <q-avatar
            text-color="grey-10"
            icon="eva-download-outline"
            font-size="22px"
          />
        </template>
        Install Engraved ?
        <template v-slot:action>
          <q-btn @click="installApp()" class="q-px-sm" label="Yes" dense flat />
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
      <q-route-tab to="/" icon="eva-home-outline" name="Home" />
      <q-route-tab to="/search" icon="eva-search-outline" name="Search" />
      <q-route-tab to="/profile" icon="eva-person-outline" name="Profile" />
      <q-route-tab to="/settings" icon="eva-settings" name="Settings" />
    </q-tabs>
  </q-footer>
</template>

<script>
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
export default {
  name: "Banner",
  data() {
    return {
      showAppInstallBanner: true,
    };
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          this.neverShowAppInstallBanner();
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );
    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.red-9 {
  color: #f16258;
}
</style>
