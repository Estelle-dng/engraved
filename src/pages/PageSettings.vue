<template>
  <q-page class="constrain">
    <section class="q-pa-md">
      <div class="row justify-center">
        <div class="col col-sm-8 q-ma-md">
          <p>Profile picture</p>
          <div id="preview">
            <img v-if="bannerUrl" :src="bannerUrl" />
          </div>
          <q-file
            v-model="banner"
            class="col col-sm-8 cursor-pointer"
            label="Download image"
            color="grey-10"
            bottom-slots
            counter
            filled
            clearable
            accept="image/*"
            @input="onFileChange()"
            @clear="setOldUrl()"
          >
            <template v-slot:prepend>
              <q-icon name="upload" />
            </template>
          </q-file>
        </div>
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="bio"
          label="Biography"
          class="col col-sm-8"
          color="grey-10"
          type="textarea"
        />
      </div>
      <section v-if="tattoist">
        <div v-if="style" class="row justify-center">
          <div class="col-sm-3 col-xs-6 q-pa-sm">
            <q-input
              clearable
              filled
              color="grey-10"
              v-model="style[0]"
              label="Art style 1"
            />
          </div>
          <div class="col-sm-3 col-xs-6 q-pa-sm">
            <q-input
              clearable
              filled
              color="grey-10"
              v-model="style[1]"
              label="Art style 2"
            />
          </div>
          <div class="col-sm-3 col-xs-6 q-pa-sm">
            <q-input
              clearable
              filled
              color="grey-10"
              v-model="style[2]"
              label="Art style 3"
            />
          </div>
        </div>
        <div class="row q-ma-md justify-center">
          <q-toggle
            class="col col-8"
            label="Is your booking open ?"
            v-model="booking"
            color="red"
          />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
            v-model="contact"
            label="Contact adress"
            class="col col-sm-8"
            color="grey-10"
          />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
            v-model="location"
            :loading="locationLoading"
            label="Location"
            class="col col-sm-8"
            color="grey-10"
          >
            <template v-slot:append>
              <q-btn
                v-if="!locationLoading && locationSupported"
                @click="getLocation()"
                icon="eva-navigation-2-outline"
                dense
                flat
                round
              />
            </template>
          </q-input>
        </div>
      </section>
      <div class="row justify-center q-mt-lg">
        <q-btn @click="updateUser()" color="red" icon="send" label="Update" />
      </div>
    </section>
    <q-separator class="q-ma-lg" />
    <section class="row justify-center q-pa-lg">
      <q-btn
        @click="confirm = true"
        color="grey-7"
        icon="eva-person-delete"
        label="Delete user"
      />
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="eva-alert-circle-outline"
              color="red"
              text-color="white"
            />
            <span class="q-ml-sm">Are you sure to delete your account ?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-10" v-close-popup />
            <q-btn
              flat
              label="Delete"
              color="red"
              v-close-popup
              @click="deleteCurrentUser()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </section>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged, deleteUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  where,
  collection,
  query,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
const storage = getStorage();
const db = getFirestore();
const auth = getAuth();
const user = auth.currentUser;
export default {
  name: "PageSettings",
  data() {
    return {
      confirm: false,
      locationLoading: false,
      style: [],
      bio: "",
      contact: "",
      booking: true,
      location: "",
      banner: null,
      baseUrl: "",
      bannerUrl: "",
      tattoist: false,
    };
  },
  computed: {
    locationSupported() {
      if ("geolocation" in navigator) return true;
      return false;
    },
  },
  methods: {
    async getUserData() {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          const userInfo = doc(db, "users", user.uid);
          getDoc(userInfo)
            .then((res) => {
              let user = res.data();
              this.tattoist = user.tattoist;

              this.bio = user.bio ? user.bio : this.bio;
              this.contact = user.contact ? user.contact : this.contact;
              this.style = user.style ? user.style : this.style;
              this.location = user.location ? user.location : this.location;
              this.bannerUrl = user.photo ? user.photo : this.bannerUrl;
              this.booking = user.booking ? user.booking : this.booking;
              this.baseUrl = user.photo ? user.photo : this.baseUrl;
            })
            .catch((err) => {
              this.$q.dialog({
                title: "Error",
                message: "Could not get user data",
              });
            });
        } else {
          this.$router.push("/auth");
        }
      });
    },
    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError();
        },
        { timeout: 7000 }
      );
    },
    getCityAndCountry(position) {
      let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1;`;
      this.$axios
        .get(apiUrl)
        .then((result) => {
          this.locationSuccess(result);
        })
        .catch((err) => {
          this.locationError();
        });
    },
    locationSuccess(result) {
      this.location = result.data.city;
      if (result.data.country) {
        this.location += `, ${result.data.country}`;
      }
      this.locationLoading = false;
    },
    locationError() {
      let locationErrorMessage = "Could not find location";
      if (this.$q.platform.is.mac) {
        locationErrorMessage =
          "You might be able to fix this in System > Preferences > Security and Privacy > Location Services";
      }
      this.$q.dialog({
        title: "Error",
        message: locationErrorMessage,
      });
      this.locationLoading = false;
    },
    onFileChange() {
      this.bannerUrl = URL.createObjectURL(this.banner);
    },
    setOldUrl() {
      this.bannerUrl = this.baseUrl;
    },
    async updateBanner() {
      try {
        const file = this.banner;
        const token = v4();
        const storageRef = ref(storage, file.name + "&token=" + token);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch {
        (err) => {
          console.log("err : ", err);
        };
      }
    },
    async updateUser() {
      this.$q.loading.show();

      Promise.resolve(this.updateBanner()).then((resp) => {
        let photoUrl;
        if (resp !== undefined) {
          photoUrl = resp;
        } else {
          photoUrl = this.bannerUrl;
        }
        let docData;
        if (this.tattoist) {
          docData = {
            bio: this.bio,
            booking: this.booking,
            location: this.location,
            style: this.style,
            contact: this.contact,
            photo: photoUrl,
          };
        } else {
          docData = {
            bio: this.bio,
            photo: photoUrl,
          };
        }
        setDoc(doc(db, "users", auth.currentUser.uid), docData, { merge: true })
          .then((response) => {
            this.$q.notify({
              message: "Infos updated!",
              actions: [{ label: "Dismiss", color: "white" }],
            });
            this.$q.loading.hide();
            this.$router.push("/profile");
          })
          .then(() => {
            const q = query(
              collection(db, "posts"),
              where("userId", "==", auth.currentUser.uid)
            );
            return getDocs(q);
          })
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc);
              console.log(photoUrl);
              updateDoc(doc, {
                userPhoto: photoUrl,
              });
            });
            console.log(doc);
          })
          .catch((err) => {
            this.$q.notify("Error : ", err);
            this.$router.push("/");
          });
      });
    },
    deleteCurrentUser() {
      const uid = user.uid;
      deleteUser(auth.currentUser)
        .then(async () => {
          await deleteDoc(doc(db, "users", uid));
          const posts = collection(db, "posts");
          const q = query(posts, where("userId", "==", uid));
          await deleteDoc(q);
          this.$q.notify({
            message: "User deleted",
            actions: [{ label: "Dismiss", color: "white" }],
          });
          this.$router.push("/home");
        })
        .catch((error) => {
          this.$q.notify("Error, can't delete your account : ", error);
        });
    },
  },
  async activated() {
    await this.getUserData();
  },
  async created() {
    await this.getUserData();
  },
};
</script>

<style lang="scss" scoped>
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 100%;
    max-height: 300px;
  }
}
</style>
