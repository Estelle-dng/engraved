<template>
  <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
    <q-input
        v-if="tab == 'register'"
        filled
        v-model="formData.name"
        label="Your name *"
        lazy-rules
        bottom-slots
        :rules="[ val => val && val.length > 0 || 'Please type something']"
        color="grey-10"
      />
      <q-input
        filled
        v-model="formData.email"
        type="email"
        label="Your email *"
        lazy-rules
        bottom-slots
        color="grey-10"
      />
      <q-input
      v-model="formData.password"
      filled
      :type="isPwd ? 'password' : 'text'"
      hint=""
      label="Your password *"
      lazy-rules
      :error="!isValid"
      bottom-slots
      color="grey-10"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        <template v-slot:error>
          {{errorMessage}}
        </template>
      </q-input>
      <q-separator/>
      <template v-if="tab === 'register'">
        <div class="text-center q-mb-lg">Sign up with</div>
      </template>
      <template v-else>
        <div class="text-center q-mb-lg">Sign in with</div>
      </template>
      <div class="flex flex-center">
        <q-btn class="flex flex-center q-px-md q-py-sm q-mb-md" icon="eva-google" size="md" color="indigo-10" label="Google"
          @click="google"
        />
      </div>
      <div v-if="tab == 'register'">
        <q-toggle v-model="formData.tattoist" label="I'm a tattoo artist" />
        <q-toggle v-model="formData.accept" label="I accept the license and terms" />
      </div>
      <div>
        <q-btn :label="tab" type="submit" color="grey-10"/>
      </div>
    </q-form>
    <div class="text-center q-my-md">
      <q-btn flat label="Forgot Password?" color="grey" class="text-capitalize rounded-borders"
        v-if="tab !== 'register'" @click="forgotPassword" />
    </div>
    <q-dialog v-model="resetPwdDialog">
      <forgot-password />
    </q-dialog>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from "firebase/auth";
import { setDoc, doc, getFirestore } from "firebase/firestore";
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
export default {
  components:{
    'forgot-password' : require('components/ForgotPassword.vue').default,
  },
  props: ['tab'],
  data () {
    return {
      resetPwdDialog: false,
      formData:{
        name : '',
        email: '',
        password: '',
        tattoist : false,
        accept: false,
      },
      isPwd: true,
      isValid: true,
      errorMessage: ""
    }
  },
  methods: {
    onSubmit () {
      if (this.tab === 'login') {
        setPersistence(auth, browserLocalPersistence).then(() => {
          this.signInExistingUser();
          }
        );
      } else {
          if (this.formData.accept !== true) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        } else {
          this.createUser();
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }
      }
    },
    google () {
      setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithPopup(auth, provider)
          .then((result) => {
            const userInfo = result.user;
            const user = doc(db, 'users', auth.currentUser.uid);
            setDoc(user, { name: userInfo.displayName, tattoist : false, photo: userInfo.photoURL }, { merge: true });
            // ...
            this.$router.push('/');
            this.$q.notify({
              message: 'User logged!',
              actions: [
                { label: 'Dismiss', color: 'white' }
              ]
            })
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
          });
        });
    },
    signInExistingUser(){
      this.$q.loading.show();
      const email =  this.formData.email;
      const password = this.formData.password;
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.$router.push('/');
        this.$q.notify({
          message: 'User logged!',
          actions: [
            { label: 'Dismiss', color: 'white' }
          ]
        });
        this.$q.loading.hide();
      })
      .catch((error) => {
        if(error.code == "auth/wrong-password"){
          this.isValid = false;
          this.errorMessage = "Wrong password."
        }
        if(error.code == "auth/too-many-requests"){
          this.isValid = false;
          this.errorMessage = "Too failed many requests, please try later"
        }
        this.$q.notify({
            message: error.message,
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        this.$q.loading.hide();
      });
    },
    createUser(){
      this.$q.loading.show();
      const email =  this.formData.email;
      const password = this.formData.password;
      const tattoist = this.formData.tattoist;
      const accepted = this.formData.accept;
      const userName = this.formData.name;
      createUserWithEmailAndPassword(auth, email, password, userName, tattoist, accepted)
        .then(() => {
          const user = doc(db, 'users', auth.currentUser.uid);
          setDoc(user, { name: userName, tattoist : tattoist }, { merge: true });
          this.$q.notify({
            message: 'User created!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
          this.$router.push('/auth');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('error : ', errorCode, " /// error : ", errorMessage);
          this.$q.loading.hide();
        });
    },
    forgotPassword () {
      this.resetPwdDialog = true;
    },
  },
}

</script>
