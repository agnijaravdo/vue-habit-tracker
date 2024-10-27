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

export function isHabitExist(habitName) {
  return habits.value.find((h) => h.name === habitName)
}

export function removeHabit(habitName) {
  const indexOfHabit = habits.value.findIndex((h) => h.name === habitName)
  if (indexOfHabit === -1) return
  habits.value.splice(indexOfHabit, 1)
}

export function addNewHabit(habitName) {
  if (isHabitExist(habitName)) return
  habits.value.push({ name: habitName })
}

export function getListOfHabits() {
  return habits.value
}
