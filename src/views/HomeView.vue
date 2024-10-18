<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import Drawer from 'primevue/drawer'
import Knob from 'primevue/knob'
import { useRoute, useRouter } from 'vue-router'

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

const buttondisplay = ref(paramsDay || new Date())

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

const habits = ref([
  { id: 1, name: '🏃‍♂️ Exercise' },
  { id: 2, name: '📖 Read' },
  { id: 3, name: '🧘 Meditate' },
  { id: 4, name: '✍️ Write' }
])

const newHabit = ref('')
let nextHabitId = 5

const deleteHabit = (id) => {
  habits.value = habits.value.filter((h) => h.id !== id)
}

const addNewHabit = () => {
  if (newHabit.value) {
    habits.value.push({
      id: (nextHabitId += 1),
      name: newHabit.value
    })
    newHabit.value = ''
  }
}

const isSelectedDayAFutureDate = computed(() => {
  const today = new Date()
  const selectedDate = new Date(buttondisplay.value)

  today.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)

  return selectedDate > today
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex justify-between items-center p-4 bg-gray-100 border-b">
      <h1 class="text-xl font-bold">Habit Hack</h1>
      <Button
        label="Show and update habits list"
        icon="pi pi-arrow-left"
        @click="drawerVisible = true"
      />
    </div>

    <Drawer v-model:visible="drawerVisible" position="right">
      <template #header>
        <div class="flex justify-between items-center p-2">
          <h1 class="text-2xl font-bold">Tracked Habits</h1>
        </div>
      </template>
      <DataTable :value="habits" class="mt-1">
        <Column field="name"></Column>
        <Column class="!text-right">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              @click="deleteHabit(data.id)"
              severity="secondary"
              class="p-button-text"
            ></Button>
          </template>
        </Column>
      </DataTable>
      <div class="mt-4">
        <InputGroup class="flex items-center">
          <InputText
            v-model="newHabit"
            id="new-habit"
            placeholder="Enter New Habit"
            class="flex-1"
            v-on:keyup.enter="addNewHabit"
          />
          <Button icon="pi pi-plus" severity="success" @click="addNewHabit" />
        </InputGroup>
      </div>
    </Drawer>

    <div class="flex-1 overflow-y-auto p-10">
      <div class="w-full max-w-7xl mx-auto px-10">
        <div class="flex justify-end mb-4">
          <Calendar v-model="buttondisplay" showIcon :showOnFocus="false" />
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
          <Knob v-model="knobValue" valueTemplate="{value}%" class="flex justify-center py-4" />

          <div class="space-y-2">
            <div
              v-for="habit of habits"
              :key="habit.id"
              class="p-4 flex items-center border border-gray-200 rounded-md"
            >
              <Checkbox :name="habit.name" :value="habit.name" class="mr-2" />
              <label :for="habit.id" class="cursor-pointer">{{ habit.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="bg-gray-100 p-4 text-center border-t">
      <p class="text-sm text-gray-600">© 2024 Habit Hack</p>
    </footer>
  </div>
</template>
