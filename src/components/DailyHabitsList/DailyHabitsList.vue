<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import { watch, computed } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import useCalendar from '@store/calendar'
import useHabits from '@store/habits'
import store from '@store/store'
import EmptyState from '@components/EmptyState.vue'
import useHabitsProgress from './useHabitsProgress'

const { isSelectedDayIsToday } = useCalendar()
const { toggleCompletion, isHabitChecked, isHabitDisabled, habits } = useHabits()

const filteredHabits = computed(() => {
  const dateObject = new Date(store.dateDisplay)
  const utcDate = new Date(
    Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate())
  )
  const selectedDate = utcDate.toISOString()

  return habits.value.filter((habit) => habit.creationDate && habit.creationDate <= selectedDate)
})

const { habitsProgress } = useHabitsProgress(filteredHabits, isSelectedDayIsToday, isHabitChecked)

watch(
  () => store.dateDisplay,
  (newDateDisplay) => {
    isSelectedDayIsToday.value =
      newDateDisplay.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
  }
)
</script>

<template>
  <div v-if="filteredHabits.length">
    <Knob
      v-model="habitsProgress"
      value-template="{value}%"
      class="flex justify-center py-4"
      aria-label="Habits progress bar"
    />
    <div
      v-if="habitsProgress === 100"
      class="fixed inset-0 flex items-center justify-center pointer-events-none"
    >
      <ConfettiExplosion :stage-height="2500" :stage-width="5000" :duration="5000" />
    </div>

    <section class="space-y-2" aria-label="Habits list">
      <form
        v-for="habit of filteredHabits"
        :key="habit.name"
        class="p-4 flex items-center border border-gray-200 rounded-md"
      >
        <Checkbox
          :id="habit.name"
          :binary="true"
          class="mr-2"
          :model-value="isHabitChecked(habit)"
          :disabled="isHabitDisabled(habit)"
          :name="habit.name"
          @change="() => toggleCompletion(habit)"
        />
        <label
          :id="`label-${habit.name}`"
          :for="`${habit.name}`"
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
        icon-name="pi-file-edit"
      />
    </div>
  </section>
</template>
