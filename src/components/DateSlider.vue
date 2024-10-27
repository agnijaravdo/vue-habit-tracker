<script setup>
import Button from 'primevue/button'
import useCalendar from '../store/calendar'
import { useStore } from '../store'

const store = useStore()
const { days, normalizedDisplayDate, selectDate } = useCalendar()
</script>

<template>
  <div class="py-4 gap-2 font-medium flex items-center justify-center">
    <Button icon="pi pi-angle-left" @click="store.currentWeekOffset--" />
    <div class="gap-2 flex overflow-x-auto">
      <div v-for="(day, index) in days" :key="index" class="whitespace-pre">
        <Button
          :label="`${day.dayOfTheWeek}, ${day.monthAndDay}`"
          :severity="
            day.dayFormat.getTime() === normalizedDisplayDate.getTime() ? 'info' : 'secondary'
          "
          @click="selectDate(day.dayFormat)"
        />
      </div>
    </div>
    <Button icon="pi pi-angle-right" @click="store.currentWeekOffset++" />
  </div>
</template>
