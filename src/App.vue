<script setup>
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import Message from 'primevue/message'
import MainFooter from './components/MainFooter.vue'
import MainHeader from './components/MainHeader.vue'
import store from './store/store'
import { errorCurrent } from './store/error'

const errorMessage = computed(() => (errorCurrent.value ? errorCurrent.value.message : ''))
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader @toggle-drawer="store.isDrawerVisible = !store.isDrawerVisible" />
    <main class="flex-1 overflow-y-auto p-10">
      <div v-if="errorCurrent" class="error-message flex justify-center">
        <Message severity="error">{{ errorMessage }}</Message>
      </div>
      <div v-else><RouterView /></div>
    </main>
    <MainFooter />
  </div>
</template>
