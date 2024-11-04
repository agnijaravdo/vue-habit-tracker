<script setup>
import Button from 'primevue/button'
import useCalendar from '../store/calendar'
import store from '../store/store'

const { days, normalizedDisplayDate, selectDate } = useCalendar()
</script>

<template>
  <div class="py-4 gap-2 font-medium flex items-center justify-center">
    <Button icon="pi pi-angle-left" @click="store.currentWeekOffset--" aria-label="Previous week" />
    <div class="gap-2 flex overflow-x-auto">
      <div v-for="(day, index) in days" :key="index" class="whitespace-pre">
        <nav>
          <Button
            :label="`${day.dayOfTheWeek}, ${day.monthAndDay}`"
            :severity="
              day.dayFormat.getTime() === normalizedDisplayDate.getTime() ? 'info' : 'secondary'
            "
            @click="selectDate(day.dayFormat)"
            aria-label="Day of the week"
          />
        </nav>
      </div>
    </div>
    <Button icon="pi pi-angle-right" @click="store.currentWeekOffset++" aria-label="Next week" />
  </div>
</template>
