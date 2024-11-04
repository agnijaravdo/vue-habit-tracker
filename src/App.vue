<script setup>
import { RouterView } from 'vue-router'
import MainFooter from './components/MainFooter.vue'
import MainHeader from './components/MainHeader.vue'
import store from './store/store'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader @toggle-drawer="store.isDrawerVisible = !store.isDrawerVisible" />
    <main class="flex-1 overflow-y-auto p-10">
      <RouterView />
    </main>
    <MainFooter />
  </div>
</template>
