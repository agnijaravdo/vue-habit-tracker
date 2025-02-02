import { ref, watchEffect } from 'vue'

function useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked) {
  const habitsProgress = ref(0)

  const calculateDailyHabitsProgressValue = () => {
    const activeHabits = habits.value.filter(
      (habit) => !(habit.isStopped && isSelectedDayIsToday.value)
    )
    const completedActiveHabits = activeHabits.filter(isHabitChecked)

    if (!activeHabits.length) {
      habitsProgress.value = 0
      return
    }

    habitsProgress.value = Math.round((completedActiveHabits.length / activeHabits.length) * 100)
  }

  watchEffect(() => {
    calculateDailyHabitsProgressValue()
  })

  return {
    habitsProgress
  }
}

export default useHabitsProgress
