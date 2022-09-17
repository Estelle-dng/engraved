<template>
  <!-- Notification banner -->
  <div
    v-if="showNotificationsBanner && pushNotificationsSupported"
    class="q-ma-sm"
  >
    <q-banner dense inline-actions class="bg-grey-10 text-white constrain">
      <template v-slot:avatar>
        <q-avatar
          text-color="grey-10 bg-red"
          icon="eva-bell-outline"
          font-size="22px"
        />
      </template>
      Enable notifications ?
      <template v-slot:action>
        <q-btn
          @click="enableNotifications()"
          class="q-px-sm"
          label="Yes"
          dense
          flat
        />
        <q-btn
          @click="showNotificationsBanner = false"
          class="q-px-sm"
          label="Later"
          dense
          flat
        />
        <q-btn
          @click="neverShowNotificationsBanner()"
          class="q-px-sm"
          label="Never"
          dense
          flat
        />
      </template>
    </q-banner>
  </div>
</template>

<script>
export default {
  name: "Notif",
  data() {
    return {
      showNotificationsBanner: false,
    };
  },
  computed: {
    serviceWorkerSupported() {
      if ("serviceWorker" in navigator) return true;
      return false;
    },
    pushNotificationsSupported() {
      if ("PushManager" in window) return true;
      return false;
    },
  },
  methods: {
    initNotificationsBanner() {
      let neverShowNotificationsBanner = this.$q.localStorage.getItem(
        "neverShowNotificationsBanner"
      );

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true;
      }
    },
    enableNotifications() {
      if (this.pushNotificationsSupported) {
        Notification.requestPermission((result) => {
          this.neverShowNotificationsBanner();
          if (result == "granted") {
            //this.displayGrantedNotifications();
            this.checkForExistingPushSubscription();
          }
        });
      }
    },
    checkForExistingPushSubscription() {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        let reg;
        navigator.serviceWorker.ready
          .then((swreg) => {
            reg = swreg;
            swreg.pushManager.getSubscription();
          })
          .then((sub) => {
            if (!sub) {
              //Create a new subscription
              this.createPushSubscription(reg);
            }
          });
      }
    },
    createPushSubscription(registration) {
      let vapidPublicKey =
        "BK9haeBXyHenav_5-1gTT-e7rAwvSFwEWSIAIe1EJrLUKfzfiTA3vGNf5n1yuhIA_5qQq8ySZL3qVDtL91eso-s";
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        })
        .then((newSub) => {
          let newSubData = newSub.toJSON();
          let newSubDataQS = qs.stringify(newSubData);
          return this.$axios.post(
            `${process.env.API}/createSubscription?${newSubDataQS}`
          );
        })
        .then((response) => {
          this.displayGrantedNotifications();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    displayGrantedNotifications() {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        navigator.serviceWorker.ready.then((swreg) => {
          swreg.showNotification("You are now subscribed to notifications !", {
            body: "Thanks for subscribing",
            icon: "icons/icon-128x128.png",
            image: "icons/icon-128x128.png",
            badge: "icons/icon-128x128.png",
            lang: "en-US",
            vibrate: [100, 50, 200],
            /* actions: [
              {
                action : 'hello',
                title : 'hello',
                icon : 'icons/icon-128x128.png'
              } ,
            ]*/
          });
        });
      }
    },
    neverShowNotificationsBanner() {
      this.showNotificationsBanner = false;
      this.$q.localStorage.set("neverShowNotificationsBanner", true);
    },
  },
  activated() {
    this.initNotificationsBanner();
  },
};
</script>
