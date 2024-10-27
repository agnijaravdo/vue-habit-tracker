<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import HabitDrawer from '../components/HabitDrawer.vue'
import { getListOfHabits, removeHabitCompletion } from '../store/habitsList'

const route = useRoute()
const router = useRouter()

const isValidDate = (dateString) => {
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime())
}

const currentWeekOffset = ref(0)
const drawerVisible = ref(false)
const knobValue = ref(60) // tmp value

const paramsDay = isValidDate(route.params.day) ? new Date(route.params.day) : null

const dateDisplay = ref(paramsDay || new Date())

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
  const startOfWeek = getStartOfWeek(paramsDay ? dateDisplay.value : new Date())
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
  const normalizedDate = new Date(dateDisplay.value)
  normalizedDate.setHours(0, 0, 0, 0)
  return normalizedDate
})

const selectDate = (date) => {
  dateDisplay.value = new Date(date)
}

const isSelectedDayAFutureDate = computed(() => {
  const today = new Date()
  const selectedDate = new Date(dateDisplay.value)

  today.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  return selectedDate > today
})

const habits = getListOfHabits()
const formattedDate = computed(() => formatDate(dateDisplay.value))

const isHabitChecked = (habit) => {
  const habitByName = habits.find((h) => h.name === habit.name)
  const isCompleted = habitByName?.datesWhenCompleted?.includes(formattedDate.value)
  return isCompleted
}

const toggleCompletion = (habit) => {
  const habitByName = habits.find((h) => h.name === habit.name)
  if (!habitByName?.datesWhenCompleted) {
    habitByName.datesWhenCompleted = []
  }

  if (isHabitChecked(habit)) {
    removeHabitCompletion(habitByName.name, formattedDate.value)
  } else {
    habitByName.datesWhenCompleted.push(formattedDate.value)
  }
}

watch(dateDisplay, (newDate, oldDate) => {
  if (newDate.getTime() !== oldDate.getTime()) {
    const startOfCurrWeek = getStartOfWeek(new Date())
    const startOfNewWeek = getStartOfWeek(newDate)
    const diffWeeks = Math.round((startOfNewWeek - startOfCurrWeek) / (1000 * 60 * 60 * 24 * 7))
    currentWeekOffset.value = diffWeeks
    router.push({ name: 'day', params: { day: formatDate(newDate) } })
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader @toggle-drawer="drawerVisible = !drawerVisible" />
    <HabitDrawer v-model:visible="drawerVisible" />

    <div class="flex-1 overflow-y-auto p-10">
      <div class="w-full max-w-7xl mx-auto px-10">
        <div class="flex justify-end mb-4">
          <DatePicker v-model="dateDisplay" showIcon :showOnFocus="false" />
        </div>

        <div class="py-4 gap-2 font-medium flex items-center justify-center">
          <Button icon="pi pi-angle-left" @click="currentWeekOffset--" />
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
          <Button icon="pi pi-angle-right" @click="currentWeekOffset++" />
        </div>

        <div v-if="isSelectedDayAFutureDate" class="text-center text-gray-500 p-10">
          <i
            class="pi pi-exclamation-circle animate-pulse text-[#FCDE70]"
            style="font-size: 4rem"
          ></i>
          <p class="p-4">
            You cannot mark habits for future dates, please select a past or current date.
          </p>
        </div>

        <div v-else>
          <div v-if="habits.length">
            <Knob v-model="knobValue" valueTemplate="{value}%" class="flex justify-center py-4" />

            <div class="space-y-2">
              <div
                v-for="habit of habits"
                :key="habit.name"
                class="p-4 flex items-center border border-gray-200 rounded-md"
              >
                <Checkbox
                  :binary="true"
                  class="mr-2"
                  :modelValue="isHabitChecked(habit)"
                  @change="toggleCompletion(habit)"
                />
                <label :for="habit.name" class="cursor-pointer">{{ habit.name }}</label>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 p-10">
            <i class="pi pi-file-edit animate-pulse text-[#FCDE70]" style="font-size: 4rem"></i>
            <p class="p-4">
              Your habits list is empty. Please enter your habits by clicking 'Your habits list'
              button.
              <i class="pi pi-arrow-up-right text-[rgb(107 114 128)]" style="font-size: 1rem"></i>
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer class="bg-gray-100 p-4 text-center border-t">
      <p class="text-sm text-gray-600">© 2024 Habit Hack</p>
    </footer>
  </div>
</template>
