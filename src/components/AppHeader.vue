<script setup>
import Button from 'primevue/button'

defineEmits(['toggle-drawer'])
</script>

<template>
  <div class="flex justify-between items-center p-4 bg-gray-100 border-b">
    <RouterLink to="/">
      <h1 class="text-xl font-bold cursor-pointer">Habit Hack</h1>
    </RouterLink>
    <Button label="Your habits list" icon="pi pi-arrow-left" @click="$emit('toggle-drawer')" />
  </div>
</template>
