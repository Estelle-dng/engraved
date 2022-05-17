<template>
  <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
    <q-input
        v-if="tab == 'register'"
        filled
        v-model="formData.name"
        label="Your name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        v-model="formData.email"
        type="email"
        label="Your email *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        v-model="formData.password"
        type="password"
        label="Your password *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

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
        <q-btn label="Reset" type="reset" color="red" flat class="q-ml-sm" />
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
import { join } from "path";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
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
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.tab === 'login') {
        this.signInExistingUser()
      } else {
          if (this.formData.accept !== true) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        } else {
          this.createUser()
        }
      }
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
    },
    forgotPassword () {
      this.resetPwdDialog = true;
    },
    onReset () {
      console.log('reset');
      this.name = null
      this.email = null
      this.password = null
      this.accept = false
      this.tattoist = false
    },
    google () {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
          this.$router.push('/');
          this.$q.notify({
            message: 'User logged!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    signInExistingUser(){
      this.$q.loading.show();
      console.log('sign in');
      const email =  this.formData.email;
      const password = this.formData.password;
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.$router.push('/');
          this.$q.notify({
            message: 'User logged!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.$q.loading.hide();
      });
    },
    createUser(){
      this.$q.loading.show();
      const email =  this.formData.email;
      const password = this.formData.password;
      console.log('register');
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$router.push('/');
          this.$q.notify({
            message: 'User created!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.$q.loading.hide();
          // ..
        });
    },
  },
}

</script>
