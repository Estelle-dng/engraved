<template>
  <q-page class="constrain">
    <section class="q-pa-md">
      <div class="row  justify-center">
        <div class="col col-sm-8 q-ma-md">
          <p>Profile picture</p>
          <q-file
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
            <q-icon name="upload"/>
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
    <div class="row justify-center">
      <div class="col-sm-3 col-xs-6 q-pa-sm"><q-input clearable filled color="grey-10"  v-model="style[0]" label="Art style 1" /></div>
      <div class="col-sm-3 col-xs-6 q-pa-sm"><q-input clearable filled color="grey-10"  v-model="style[1]" label="Art style 2" /></div>
      <div class="col-sm-3 col-xs-6 q-pa-sm"><q-input clearable filled color="grey-10"  v-model="style[2]" label="Art style 3" /></div>
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
    <div class="row justify-center q-mt-lg">
       <q-btn
       @click="updateUser()"
       color="red"
       icon="send"
       label="Update"
       />
    </div>
    </section>
    <q-separator class="q-ma-lg"/>
     <div class="row justify-center q-pa-lg">
       <q-btn
       @click="deleteUser()"
       color="grey-7"
       icon="eva-person-delete"
       label="Delete user"
       />
    </div>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
const db = getFirestore();
const auth = getAuth();
export default {
  name: 'PageSettings',

  data(){
    return{
       locationLoading: false,
       style: [],
       bio : '',
       contact: '',
       booking: true,
       location: ''
    }
  },
  computed:{
    locationSupported() {
      if ('geolocation' in navigator) return true;
      return false;
    },
  },
  methods: {
    getUserData(){
      onAuthStateChanged(auth, (user) => {
        if (user.uid) {

          const userInfo = doc(db, "users", user.uid);
          const docSnap = getDoc(userInfo).then(res => {
            let user = res.data();

            this.bio = user.bio;
            this.contact = user.contact;
            this.style = user.style;
            this.location = user.location;
            this.banner = user.photo;
            this.booking = user.booking;

          }).catch(err => {console.log('error : ', err);});

          return true;
        } else {
          console.log('User is signed out');
          return;
        }
      });
      if(onAuthStateChanged) return true;
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
      this.location = result.data.city;
      if (result.data.country){
        this.location += `, ${result.data.country}`
      }
      this.locationLoading = false;
    },
    locationError(){
      let locationErrorMessage = 'Could not find location';
      if(this.$q.platform.is.mac){
        locationErrorMessage = 'You might be able to fix this in System > Preferences > Security and Privacy > Location Services'
      }
      this.$q.dialog({
        title: 'Error',
        message: locationErrorMessage
      });
      this.locationLoading = false;
    },
    updateUser() {
      this.$q.loading.show();

      const docData = {
          bio: this.bio,
          booking: this.booking,
          location: this.location,
          style: this.style,
          contact: this.contact,
          banner: {}
      };
      setDoc(doc(db, "users", auth.currentUser.uid), docData, { merge: true }).then(response => {
          this.$q.notify({
            message: 'Infos updated!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
        }).catch(err => {
            this.$q.notify('Error : ', err);
            this.$router.push('/');
        });
    },
    deleteUser(){

    }
  },
  activated(){
    this.getUserData();
  },
  created(){
    this.getUserData();
  }
}
</script>
