<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import store from './store/store'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header @toggle-drawer="store.isDrawerVisible = !store.isDrawerVisible" />
    <main class="flex-1 overflow-y-auto p-10">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
