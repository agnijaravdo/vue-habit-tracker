import { computed } from 'vue'
import type { Habit } from '@/store/habits'

function useHabitsProgress(
  habits: { value: Habit[] },
  isSelectedDayIsToday: { value: boolean },
  isHabitChecked: (habit: Habit) => boolean
) {
  const habitsProgress = computed(() => {
    const activeHabits = habits.value.filter(
      (habit) => !(habit.isStopped && isSelectedDayIsToday.value)
    )
    const completedActiveHabits = activeHabits.filter(isHabitChecked)

    if (!activeHabits.length) {
      return 0
    }

    return Math.round((completedActiveHabits.length / activeHabits.length) * 100)
  })

  return {
    habitsProgress
  }
}

export default useHabitsProgress
