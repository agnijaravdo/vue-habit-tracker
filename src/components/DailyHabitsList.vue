<script setup>
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import { ref, watchEffect } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import EmptyState from './EmptyState.vue'
import useCalendar from '../store/calendar'
import { getListOfHabits, removeHabitCompletion } from '../store/habitsList'

const { formattedDate } = useCalendar()
const habits = getListOfHabits()
const knob = ref(0)

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

watchEffect(() => {
  knob.value = Math.round(
    (habits.filter((habit) => isHabitChecked(habit)).length / habits.length) * 100
  )
})
</script>

<template>
  <div v-if="habits.length">
    <Knob v-model="knob" valueTemplate="{value}%" class="flex justify-center py-4" />
    <div
      class="fixed inset-0 flex items-center justify-center pointer-events-none"
      v-if="knob === 100"
    >
      <ConfettiExplosion
        v-if="knob === 100"
        :stageHeight="2500"
        :stageWidth="5000"
        :duration="5000"
      />
    </div>

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
  <div v-else>
    <div class="text-center text-gray-500 p-10">
      <EmptyState
        text="Your habits list is empty. Please enter your habits by clicking 'Your habits list' button."
        iconName="pi-file-edit"
      />
    </div>
  </div>
</template>
