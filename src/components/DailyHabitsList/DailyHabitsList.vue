<script setup>
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import { watch } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import EmptyState from '../EmptyState.vue'
import useCalendar from '../../store/calendar'
import useHabits from '../../store/habits'
import store from '../../store/store'
import useHabitsProgress from './useHabitsProgress'

const { isSelectedDayIsToday } = useCalendar()
const { toggleCompletion, isHabitChecked, isHabitDisabled, habits } = useHabits()
const habitsList = habits.value

const { habitsProgress } = useHabitsProgress(habitsList, isSelectedDayIsToday, isHabitChecked)

watch(
  () => store.dateDisplay,
  (newDateDisplay) => {
    isSelectedDayIsToday.value =
      newDateDisplay.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
  }
)
</script>

<template>
  <div v-if="habitsList.length">
    <Knob v-model="habitsProgress" valueTemplate="{value}%" class="flex justify-center py-4" />
    <div
      class="fixed inset-0 flex items-center justify-center pointer-events-none"
      v-if="habitsProgress === 100"
    >
      <ConfettiExplosion :stageHeight="2500" :stageWidth="5000" :duration="5000" />
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
          @change="() => toggleCompletion(habit)"
          :disabled="isHabitDisabled(habit)"
        />
        <label
          :for="habit.name"
          :class="isHabitDisabled(habit) ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'"
        >
          {{ habit.name }}
        </label>
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
