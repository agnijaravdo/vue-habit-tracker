<script setup>
import Button from 'primevue/button'
import { errorCurrent, setError } from '../store/error'

defineEmits(['toggle-drawer'])
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-gray-100 border-b sticky top-0 z-10">
    <nav>
      <RouterLink to="/" @click="setError(null)">
        <div class="flex items-center space-x-2">
          <h1 class="text-2xl font-bold cursor-pointer">Habit Hack</h1>
          <i class="pi pi-calendar-times text-emeraldGreen" style="font-size: 1.5rem"></i>
        </div>
      </RouterLink>
    </nav>
    <Button
      v-if="!errorCurrent"
      label="Your habits list"
      icon="pi pi-arrow-left"
      @click="$emit('toggle-drawer')"
    />
  </header>
</template>
