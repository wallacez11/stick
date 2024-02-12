<template>
  <AppNavigation msg="Welcome to Your Vue.js App" />
  <AppBody msg="Welcome to Your Vue.js App" />
</template>

<script>
import AppBody from "./components/AppBody.vue";
import AppNavigation from "./components/AppNavBar.vue";

export default {
  name: "App",
  components: {
    AppBody,
    AppNavigation,
  },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
</style>
