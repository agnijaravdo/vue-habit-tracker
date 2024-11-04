import { ref, watch } from 'vue'
import { setError } from './error'

const HABITS_STORAGE_KEY = 'habits'

function getStoredHabits() {
  try {
    const habitsStored = localStorage.getItem(HABITS_STORAGE_KEY)
    return habitsStored ? JSON.parse(habitsStored) : []
  } catch (e) {
    return []
  }
}

const habits = ref(getStoredHabits())

watch(
  habits,
  (updatedHabits) => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits))
    } catch (error) {
      setError(
        new Error('Could not store your habit. You might need to refresh the page', {
          cause: error
        })
      )
    }
  },
  { deep: true }
)

export function isHabitExist(habitName) {
  return habits.value.find((h) => h.name === habitName)
}

export function removeHabit(habitName) {
  const indexOfHabit = habits.value.findIndex((h) => h.name === habitName)
  if (indexOfHabit === -1) return
  habits.value.splice(indexOfHabit, 1)
}

export function stopHabitStartingToday(habitName) {
  const habit = habits.value.find((h) => h.name === habitName)

  if (!habit) return
  const updatedHabit = habit.datesWhenCompleted.filter(
    (date) => date < new Date().toISOString().split('T')[0]
  )
  habit.datesWhenCompleted = updatedHabit
}

export function editHabitName(oldHabitName, newHabitName) {
  const habit = habits.value.find((h) => h.name === oldHabitName)
  if (!habit) return
  habit.name = newHabitName
}

export function removeHabitCompletion(habitName, completionDate) {
  const habit = habits.value.find((h) => h.name === habitName)
  if (!habit) return
  const newHabits = habit.datesWhenCompleted.filter((date) => date !== completionDate)
  habit.datesWhenCompleted = newHabits
}

export function addNewHabit(habitName) {
  if (isHabitExist(habitName)) return
  habits.value.push({ name: habitName })
}

export function getListOfHabits() {
  return habits.value
}
