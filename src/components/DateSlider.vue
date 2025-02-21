<script setup lang="ts">
import Button from 'primevue/button'
import useCalendar from '@store/calendar'
import store from '@store/store'

const { days, normalizedDisplayDate, selectDate } = useCalendar()
</script>

<template>
  <div class="py-4 gap-2 font-medium flex items-center justify-between">
    <Button
      icon="pi pi-angle-left"
      aria-label="Previous week"
      @click="store.currentWeekOffset--"
    />
    <div class="gap-2 flex overflow-x-auto">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="whitespace-pre"
      >
        <nav>
          <Button
            :label="`${day.dayOfTheWeek}, ${day.monthAndDay}`"
            :severity="
              day.dayFormat.getTime() === normalizedDisplayDate.getTime() ? 'info' : 'secondary'
            "
            aria-label="Day of the week"
            @click="selectDate(day.dayFormat)"
          />
        </nav>
      </div>
    </div>
    <Button
      icon="pi pi-angle-right"
      aria-label="Next week"
      @click="store.currentWeekOffset++"
    />
  </div>
</template>
