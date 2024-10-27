<script setup>
import { defineProps } from 'vue'

const { text, iconName } = defineProps(['text', 'iconName'])
</script>

<template>
  <div class="text-center text-gray-500 p-10">
    <i :class="`pi ${iconName} animate-pulse text-[#FCDE70]`" style="font-size: 4rem"></i>
    <p class="p-4">
      {{ text }}
    </p>
  </div>
</template>
