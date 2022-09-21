<template>
  <q-page class="constrain-camera">
    <div class="camera-frame relative-position">
      <video
        v-show="!imageCaptured"
        ref="capture"
        class="full-width"
        autoplay
        playsinline
      />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />

      <q-btn
        v-show="hasCameraSupport && showFlip"
        round
        color="grey-10"
        icon="eva-flip-2-outline"
        size="md"
        type="button"
        class="change-camera-type button q-mb-md q-mr-md absolute-bottom-right"
        @click="toggleCameraType"
      />
    </div>
    <section class="q-pa-md">
      <div class="text-center q-mt-md">
        <q-btn
          v-show="hasCameraSupport"
          @click="captureImg"
          :disable="imageCaptured"
          round
          color="grey-10"
          icon="eva-camera"
          size="lg"
        />

        <q-btn
          v-show="hasCameraSupport && imageCaptured"
          @click="resetCamera"
          round
          color="grey-10"
          icon="eva-refresh"
          size="lg"
          class="q-ml-md"
        />
      </div>

      <p class="text-center q-my-lg">or</p>

      <div class="row justify-center q-ma-md">
        <q-file
          v-model="imageUpload"
          @input="displayUploadImage"
          @clear="resetUpload()"
          class="col col-sm-8 cursor-pointer"
          label="Download image"
          color="grey-10"
          bottom-slots
          counter
          filled
          clearable
          accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="upload" />
          </template>
        </q-file>

        <!-- <q-btn @click="uploadImage()">test</q-btn> -->
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.caption"
          label="Caption *"
          class="col col-sm-8"
          color="grey-10"
        />
      </div>
      <div class="row justify-center">
        <div class="col-sm-3 col-xs-6 q-pa-sm">
          <q-input
            clearable
            filled
            color="grey-10"
            v-model="post.hashtags[0]"
            label="Hashtag 1"
          />
        </div>
        <div class="col-sm-3 col-xs-6 q-pa-sm" v-if="post.hashtags[0]">
          <q-input
            clearable
            filled
            color="grey-10"
            v-model="post.hashtags[1]"
            label="Hashtag 2"
          />
        </div>
        <div
          class="col-sm-3 col-xs-6 q-pa-sm"
          v-if="post.hashtags[0] && post.hashtags[1]"
        >
          <q-input
            clearable
            filled
            color="grey-10"
            v-model="post.hashtags[2]"
            label="Hashtag 3"
          />
        </div>
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          v-model="post.location"
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
      <div class="row justify-center q-mt-lg">
        <q-btn
          @click="addPost()"
          :disable="!post.caption || !post.img"
          color="red"
          icon="send"
          label="Post"
        />
      </div>
    </section>
  </q-page>
</template>

<script>
import { uid } from "quasar";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
const storage = getStorage();
const db = getFirestore();
const auth = getAuth();
require("md-gum-polyfill");

export default {
  name: "PageCamera",
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        location: "",
        img: null,
        date: Date.now(),
        hashtags: [],
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
      cameraType: "user",
      showFlip: false,
    };
  },
  computed: {
    locationSupported() {
      if ("geolocation" in navigator) return true;
      return false;
    },
    backgroundSyncSupported() {
      if ("serviceWorker" in navigator && "SyncManager" in window) return true;
      return false;
    },
  },
  methods: {
    toggleCameraType() {
      if (
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        alert("You dont have another camera to switch to");
        return;
      }
      this.cameraType = this.cameraType === "user" ? "environment" : "user";

      this.toggleCamera();
    },
    toggleCamera() {
      this.stopCameraStream();
      this.createCameraElement();
    },
    createCameraElement() {
      const constraints = (window.constraints = {
        audio: false,
        video: {
          facingMode: { exact: this.cameraType },
        },
      });
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.$refs.capture.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },
    stopCameraStream() {
      let tracks = this.$refs.capture.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.capture.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
        });
    },
    checkFrontCamera() {
      if (this.hasCameraSupport) {
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          this.showFlip = true;
          return;
        }
      }
    },
    captureImg() {
      let video = this.$refs.capture;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.img = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    resetCamera() {
      this.initCamera();
      this.imageCaptured = false;
    },
    resetUpload() {
      this.imageUpload = [];
      this.imageCaptured = false;
    },
    displayUploadImage(file) {
      this.post.img = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");

      let reader = new FileReader();
      reader.onload = (event) => {
        let img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.capture.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
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
      this.post.location = result.data.city;
      console.log(this.post.location);
      if (result.data.country) {
        this.post.location += `, ${result.data.country}`;
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
    addpostError(err) {
      this.$q.dialog({
        title: err,
        message: "Sorry, could not create post!",
      });
    },
    async getUserInfo() {
      const query = await getDoc(doc(db, "users", auth.currentUser.uid));
      try {
        const data = query.data();
        return data;
      } catch {
        this.$q.dialog({
          title: "Error",
          message: "Could not find current user data",
        });
      }
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    async uploadImage() {
      try {
        const file = this.post.img;
        const token = v4();
        const storageRef = ref(storage, token);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch {
        this.$q.dialog({
          title: "Error",
          message: "Could not upload image",
        });
      }
    },
    async addPost() {
      this.$q.loading.show();

      const userInfo = await this.getUserInfo();
      const photoUrl = await this.uploadImage();
      const docData = {
        id: this.post.id,
        caption: this.post.caption,
        location: this.post.location,
        lowerLocation: this.post.location.toLowerCase(),
        date: parseInt(this.post.date),
        imageUrl: photoUrl,
        userId: auth.currentUser.uid,
        hashtags: this.post.hashtags.filter((x) => x !== null),
        lowerHashtags: this.post.hashtags
          .filter((x) => x !== null)
          .map((element) => {
            return element.toLowerCase();
          }),
        userName: userInfo.name,
        lowerUserName: userInfo.name.toLowerCase(),
        userPhoto: userInfo.photo ? userInfo.photo : "",
      };

      setDoc(doc(db, "posts", this.post.id), docData)
        .then(() => {
          this.$q.loading.hide();
          this.$router.push("/");
          if (this.$q.platform.is.safari) {
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          }
          this.$q.notify({
            message: "Post created!",
            actions: [{ label: "Dismiss", color: "white" }],
          });
        })
        .catch((err) => {
          this.$q.loading.hide();
          this.addPostError();
        });
    },
  },
  mounted() {
    this.initCamera();
    this.checkFrontCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>
