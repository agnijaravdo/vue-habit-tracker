<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isValidDate = (dateString) => {
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime())
}

const paramsDay = isValidDate(route.params.day) ? new Date(route.params.day) : null

const buttondisplay = ref(paramsDay || new Date())
const currentWeekOffset = ref(0)

const getStartOfWeek = (date) => {
  const weekDate = new Date(date)
  const dayOfWeek = weekDate.getDay() || 7
  weekDate.setHours(0, 0, 0, 0)
  const difference = weekDate.getDate() - dayOfWeek + 1
  return new Date(weekDate.setDate(difference))
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calculateWeekDays = (offset) => {
  const startOfWeek = getStartOfWeek(paramsDay ? buttondisplay.value : new Date())
  startOfWeek.setDate(startOfWeek.getDate() + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return {
      dayOfTheWeek: day.toLocaleString('default', { weekday: 'long' }),
      monthAndDay: day.toLocaleString('default', { day: 'numeric', month: 'short' }),
      dayFormat: new Date(day)
    }
  })
}

const days = computed(() => calculateWeekDays(currentWeekOffset.value))

const normalizedDisplayDate = computed(() => {
  const normalizedDate = new Date(buttondisplay.value)
  normalizedDate.setHours(0, 0, 0, 0)
  return normalizedDate
})

watch(buttondisplay, (newDate, oldDate) => {
  if (newDate.getTime() !== oldDate.getTime()) {
    const startOfCurrWeek = getStartOfWeek(new Date())
    const startOfNewWeek = getStartOfWeek(newDate)
    const diffWeeks = Math.round((startOfNewWeek - startOfCurrWeek) / (1000 * 60 * 60 * 24 * 7))
    currentWeekOffset.value = diffWeeks
    router.push({ name: 'day', params: { day: formatDate(newDate) } })
  }
})

const selectDate = (date) => {
  buttondisplay.value = new Date(date)
}
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
      <div class="flex justify-end mb-4">
        <Calendar v-model="buttondisplay" showIcon :showOnFocus="false" />
      </div>

      <div class="py-4 gap-2 font-medium flex justify-end">
        <Button icon="pi pi-angle-left" @click="currentWeekOffset--" />
        <div class="gap-2 flex overflow-x-auto">
          <div v-for="(day, index) in days" :key="index" class="whitespace-pre-wrap">
            <Button
              :label="`${day.dayOfTheWeek},\n${day.monthAndDay}`"
              :severity="
                day.dayFormat.getTime() === normalizedDisplayDate.getTime() ? 'info' : 'secondary'
              "
              @click="selectDate(day.dayFormat)"
            />
          </div>
        </div>
        <Button icon="pi pi-angle-right" @click="currentWeekOffset++" />
      </div>
    </div>
  </div>
</template>
