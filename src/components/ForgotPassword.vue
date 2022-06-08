<template>
  <div class="flex flex-center">
    <q-card style="width: 500px; max-width: 40vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Reset Password
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <q-form ref="resetPasswordForm">
          <q-input
            type="email"
            v-model="form.email"
            color="grey-10"
            label="Email *"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type your email']"
          />
        </q-form>
        <q-card-actions align="right">
          <div class="row q-mt-xs">
            <q-btn
              class="q-pl-md q-pr-md q-mr-md text-capitalize rounded-borders"
              label="Submit"
              color="grey-10"
              @click="resetPassword"
            />
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { join } from "path";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const auth = getAuth();
export default {
  name: "ForgotPassword",
  data (){
    return {
      form: {
        email: '',
      }
    }
  },
  methods: {
    resetPassword () {
      let userEmail = this.form.email;
      sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Check you emails !'
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.$q.notify({
            color: 'red-7',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Error : '+ errorMessage,
          })
      });

    }
  }
}
</script>
