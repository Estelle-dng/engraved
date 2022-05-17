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
      if (this.formData.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      }
      else {
        if (this.tab === 'login') {
          this.signInExistingUser(this.formData.email, this.formData.password)
        } else {
          this.createUser(this.formData.email, this.formData.password, this.formData.name, this.formData.tattoist)
        }
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
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
      this.$q.loading.show();
      let formData = new FormData();

      formData.append('email', this.email);
      formData.append('password', this.password);

      this.$axios.get(`${ process.env.API }/google`, formData).then(response => {
          //console.log('response: ', response);

          this.$router.push('/');
          this.$q.notify({
            message: 'User created!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
          if(this.$q.platform.is.safari){
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
        }).catch(err => {
          console.log('error during registration : ', err);
          this.$q.loading.hide();
        })
    },
    signInExistingUser(){
      console.log('sign in');
    },
    createUser(){
       this.$q.loading.show();
       let formData = new FormData()

        formData.append('email', this.email)
        formData.append('password', this.password)


        this.$axios.post(`${ process.env.API }/createUser`, formData).then(response => {
          //console.log('response: ', response);

          this.$router.push('/');
          this.$q.notify({
            message: 'User created!',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
          this.$q.loading.hide();
          if(this.$q.platform.is.safari){
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
        }).catch(err => {
          console.log('error during registration : ', err);
          this.$q.loading.hide();
        });
      }
    },
  }

</script>
