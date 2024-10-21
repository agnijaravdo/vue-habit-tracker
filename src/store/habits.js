import { ref, watch } from 'vue'

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
    } catch (e) {
      console.error('Error saving habits to localStorage')
    }
  },
  { deep: true }
)

export function isHabitExist(habitId) {
  return habits.value.some((h) => h.id === habitId)
}

export function removeHabit(habitId) {
  if (!isHabitExist(habitId)) return
  habits.value = habits.value.filter((h) => h.id !== habitId)
}

export function addNewHabit(habit) {
  if (isHabitExist(habit)) return
  habits.value.push(habit)
}

export function getListOfHabits() {
  return habits.value
}

export function getNextHabitId() {
  const habitsList = getListOfHabits()
  if (habitsList.length === 0) return 1
  const ids = habitsList.map((h) => h.id)
  return Math.max(...ids) + 1
}
