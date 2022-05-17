<template>
  <div class="q-pa-md constrain window-height">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="red"
          indicator-color="red"
          narrow-indicator
        >
          <q-tab name="login" label="Log In" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="login">
           <login-register :tab="tab"/>
          </q-tab-panel>

          <q-tab-panel name="register">
            <login-register :tab="tab"/>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>


    </div>
  </div>

</template>

<script>
export default {
   name: 'PageAuth',
   data () {
    return {
      tab: 'login'
    }
  },
  components:{
    'login-register' : require('components/LoginRegister.vue').default,
  }
}
</script>
