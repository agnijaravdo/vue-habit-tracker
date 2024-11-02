<script setup>
import Button from 'primevue/button'

defineEmits(['toggle-drawer'])
</script>

<template>
  <div class="flex justify-between items-center p-4 bg-gray-100 border-b">
    <RouterLink to="/">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold cursor-pointer">Habit Hack</h1>
        <i class="pi pi-calendar-times" style="color: #10b981; font-size: 1.5rem"></i>
      </div>
    </RouterLink>
    <Button label="Your habits list" icon="pi pi-arrow-left" @click="$emit('toggle-drawer')" />
  </div>
</template>
