<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'

const buttondisplay = ref(new Date())
const currentWeekOffset = ref(0)

const getStartOfWeek = (date) => {
  const startOfWeek = new Date(date)
  const dayOfWeek = startOfWeek.getDay() || 7
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1)
  return startOfWeek
}

const calculateWeekDays = (offset) => {
  const startOfWeek = getStartOfWeek(new Date())
  startOfWeek.setDate(startOfWeek.getDate() + offset * 7)

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return {
      dayOfTheWeek: day.toLocaleString('default', { weekday: 'long' }),
      monthAndDay: day.toLocaleString('default', { day: 'numeric', month: 'short' }),
      dayFormat: day
    }
  })
}

const days = computed(() => calculateWeekDays(currentWeekOffset.value))

const normalizedDisplayDate = computed(() => {
  const normalizedDate = new Date(buttondisplay.value)
  normalizedDate.setHours(0, 0, 0, 0)
  return normalizedDate
})

watch(buttondisplay, (newDate) => {
  const diffWeeks = Math.round(
    (getStartOfWeek(newDate) - getStartOfWeek(new Date())) / (1000 * 60 * 60 * 24 * 7)
  )
  currentWeekOffset.value = diffWeeks
})
</script>

<template>
  <div class="flex h-screen">
    <div class="p-10 w-1/4">
      <div class="font-medium mb-4">Overall Habits List:</div>
      <ul class="list-disc pl-6">
        <li>Drink Water</li>
        <li>Exercise</li>
      </ul>
    </div>

    <div class="p-20 w-3/4">
      <div class="flex justify-end">
        <Calendar v-model="buttondisplay" showIcon :showOnFocus="false" />
      </div>

      <div class="py-4 gap-2 font-medium mb-4 flex justify-end">
        <Button icon="pi pi-angle-left" @click="currentWeekOffset--" />
        <div class="gap-2 flex overflow-x-auto">
          <div v-for="(day, index) in days" :key="index" class="whitespace-pre-wrap">
            <Button
              :label="`${day.dayOfTheWeek},\n${day.monthAndDay}`"
              :severity="
                new Date(day.dayFormat).setHours(0, 0, 0, 0) === normalizedDisplayDate.getTime()
                  ? 'info'
                  : 'secondary'
              "
              @click="buttondisplay = new Date(day.dayFormat)"
            />
          </div>
        </div>
        <Button icon="pi pi-angle-right" @click="currentWeekOffset++" />
      </div>
    </div>
  </div>
</template>
