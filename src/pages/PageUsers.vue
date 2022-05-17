<template>
  <q-page padding>
     <div class="q-pa-md constrain">
      <q-toolbar class="bg-grey-10 text-white shadow-2">
        <q-toolbar-title>Users</q-toolbar-title>
      </q-toolbar>

      <q-list bordered v-if="!loadingPosts && users.length">
        <q-item
          v-for="user in users"
          :key="user.id"
          v-ripple
          class="q-my-sm"
          clickable
        >
          <q-item-section avatar>
            <q-avatar color="red" text-color="white">
              {{ user.letter }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
            <q-item-label caption lines="1">{{ user.email }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 q-gutter-xs">
              <q-icon name="eva-message-circle-outline" size="24px"/>
              <q-icon name="eva-edit-2-outline" size="24px"/>
              <q-icon name="eva-trash-2-outline" size="24px"/>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-if="!loadingPosts && !users.length">No users yet</div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageUsers',
  data() {
    return {
      loadingPosts: false,
      users : [],
    }
  },
  methods: {
      getUsers(){
      this.loadingUsers = true;

        this.$axios.get(`${process.env.API}/users`).then(response => {
          this.users = response.data;
          if(!navigator.onLine){this.getOfflineUsers();}
          this.loadingUsers = false;
        }
        ).catch(err => {
          if(navigator.onLine){
            this.$q.dialog({
            title: 'Error',
            message: 'Could not find users',
          });
            this.loadingUsers = false;
          }
        });

    },
  },
  activated() {
    this.getUsers();
  },
}
</script>
