<script setup>
import Button from 'primevue/button'

defineEmits(['toggle-drawer'])
</script>

<template>
  <div class="flex justify-between items-center p-4 bg-gray-100 border-b">
    <h1 class="text-xl font-bold">Habit Hack</h1>
    <Button label="Your habits list" icon="pi pi-arrow-left" @click="$emit('toggle-drawer')" />
  </div>
</template>
