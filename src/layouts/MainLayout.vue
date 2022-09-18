<template>
  <q-layout view="lHh Lpr lFf">
    <navigation />

    <q-page-container class="bg-grey-12">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>

    <banner />
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  components: {
    navigation: require("components/Header.vue").default,
    banner: require("components/Footer.vue").default,
  },
};
</script>
