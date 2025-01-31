<script setup>
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import { watch } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import useCalendar from '@store/calendar'
import useHabits from '@store/habits'
import store from '@store/store'
import EmptyState from '@components/EmptyState.vue'
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
    <Knob
      v-model="habitsProgress"
      valueTemplate="{value}%"
      class="flex justify-center py-4"
      aria-label="Habits progress bar"
    />
    <div
      class="fixed inset-0 flex items-center justify-center pointer-events-none"
      v-if="habitsProgress === 100"
    >
      <ConfettiExplosion :stageHeight="2500" :stageWidth="5000" :duration="5000" />
    </div>

    <section class="space-y-2" aria-label="Habits list">
      <form
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
          :name="habit.name"
          :id="habit.name"
        />
        <label
          :for="`${habit.name}`"
          :id="`label-${habit.name}`"
          :class="isHabitDisabled(habit) ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'"
        >
          {{ habit.name }}
        </label>
      </form>
    </section>
  </div>
  <section v-else aria-label="Empty state for no habits">
    <div class="text-center text-gray-500">
      <EmptyState
        text="Your habits list is empty. Please enter your habits by clicking 'Your habits list' button."
        iconName="pi-file-edit"
      />
    </div>
  </section>
</template>
