<template>
  <q-page class="constrain-camera q-pa-md">
    <div class="camera-frame q-pa-md">
     <video
     v-show="!imageCaptured"
     ref="capture"
     class="full-width"
     autoplay
     />
     <canvas
     v-show="imageCaptured"
      ref="canvas"
      class="full-width"
      height="240"
     />
    </div>
    <div class="text-center q-mt-md">
      <q-btn
      v-show='hasCameraSupport'
      @click = 'captureImg'
      :disable="imageCaptured"
      round color="grey-10"
      icon="eva-camera"
      size="lg"
      />
    </div>
    <p class="text-center q-my-lg">or</p>
    <div class="row justify-center q-ma-md">
      <q-file
        v-model="imageUpload"
        @input="displayUploadImage"
        class="col col-sm-8"
        label="Download image"
        bottom-slots
        counter
        filled
        accept="image/*"

      >
        <template v-slot:prepend>
          <q-icon name="upload" @click.stop />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop="post.img = null" class="cursor-pointer" />
        </template>
        <!-- <template v-slot:hint>
          Field hint
        </template> -->
      </q-file>
    </div>
    <div class="row justify-center q-ma-md">
        <q-input
        v-model="post.caption"
        label="Caption *"
        class="col col-sm-8"
        />
    </div>
    <div class="row justify-center q-ma-md">
        <q-input
        v-model="post.location"
        :loading="locationLoading"
        label="Location"
        class="col col-sm-8"
        >
          <template v-slot:append>
            <q-btn
              v-if="!locationLoading && locationSupported"
              @click="getLocation"
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
       :disable="!post.caption|| !post.img"
       color="red"
       icon="send"
       label="Post"
       />
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar';
require('md-gum-polyfill');
export default {
  name: 'PageCamera',
  data() {
    return {
      post :{
        id : uid(),
        caption : '',
        location : '',
        img: null,
        date : Date.now(),
      },
      imageCaptured : false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
    }
  },
  computed:{
    locationSupported() {
      if ('geolocation' in navigator) return true;
      return false;
    },
    backgroundSyncSupported() {
      if ('serviceWorker' in navigator && 'SyncManager' in window) return true;
      return false;
    },
  },
  methods: {
    initCamemra(){
      navigator.mediaDevices.getUserMedia({
        video : true
      }).then(stream =>{
        this.$refs.capture.srcObject = stream;
      }).catch(error => {
        this.hasCameraSupport = false;
      });
    },
     captureImg() {
      let video = this.$refs.capture;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context =  canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.img = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    displayUploadImage(file){
      this.post.img = file;

      let canvas = this.$refs.canvas;
      let context =  canvas.getContext('2d');

      let reader = new FileReader();
      reader.onload = (event) => {
          let img = new Image();
          img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img,0,0);
              this.imageCaptured = true;
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(file);

    },
    disableCamera(){
      this.$refs.capture.srcObject.getVideoTracks().forEach(track => {
        track.stop();
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    },
    getLocation(){
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position);
      }, err => {
        console.log('err : ', err);
        this.locationError();
        }, {timeout: 7000}
      )
    },
    getCityAndCountry(position){
        let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1;`
        this.$axios.get(apiUrl).then(result => {
          this.locationSuccess(result);
        }).catch(err =>{
          console.log('err : ', err);
          this.locationError();
        })
    },
    locationSuccess(result){
      this.post.location = result.data.city;
      if (result.data.country){
        this.post.location += `, ${result.data.country}`
      }
      this.locationLoading = false;
    },
    locationError(){
      this.$q.dialog({
        title: 'Error',
        message: 'Could not find location'
      });
      this.locationLoading = false;
    },
   addPost() {
      this.$q.loading.show()

      let formData = new FormData()
      formData.append('id', this.post.id)
      formData.append('caption', this.post.caption)
      formData.append('location', this.post.location)
      formData.append('date', this.post.date)
      formData.append('file', this.post.img, this.post.id + '.png')


      this.$axios.post(`${ process.env.API }/createPost`, formData).then(response => {
        console.log('response: ', response);
        this.$router.push('/');
        this.$q.notify({
          message: 'Post created!',
          actions: [
            { label: 'Dismiss', color: 'white' }
          ]
        })
        this.$q.loading.hide()
      }).catch(err => {
        if (!navigator.onLine && this.backgroundSyncSupported) {
          this.$q.notify('Post created offline');
          this.$router.push('/');
        }
        else {
          this.$q.dialog({
            title: 'Error',
            message: 'Sorry, could not create post!'
          })
        }
        this.$q.loading.hide();
      })
    }
  },
  mounted(){
    this.initCamemra();
  },
  beforeDestroy(){
    if(this.hasCameraSupport){
      this.disableCamera();
    }
  }
}
</script>

<style lang="scss">
  .camera-frame{
    border: 2px solid $grey-10;
    border-radius: 10px;
  }
</style>
