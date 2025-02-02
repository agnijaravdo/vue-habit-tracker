import { ref, watch } from 'vue'
import { setError } from './error'
import useCalendar from './calendar'

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

function useHabits() {
  const { isSelectedDayIsToday, formattedDate } = useCalendar()

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

  function isHabitExist(habitName) {
    return habits.value.find((h) => h.name === habitName)
  }

  function removeHabit(habitName) {
    const indexOfHabit = habits.value.findIndex((h) => h.name === habitName)
    if (indexOfHabit === -1) return
    habits.value.splice(indexOfHabit, 1)
  }

  function stopHabitStartingToday(habitName) {
    const habit = habits.value.find((h) => h.name === habitName)

    if (!habit) return
    const updatedHabit = habit.datesWhenCompleted.filter(
      (date) => date < new Date().toISOString().split('T')[0]
    )
    habit.datesWhenCompleted = updatedHabit
  }

  function editHabitName(oldHabitName, newHabitName) {
    const habit = habits.value.find((h) => h.name === oldHabitName)
    if (!habit) return
    habit.name = newHabitName
  }

  function removeHabitCompletion(habitName, completionDate) {
    const habit = habits.value.find((h) => h.name === habitName)
    if (!habit) return
    const newHabits = habit.datesWhenCompleted.filter((date) => date !== completionDate)
    habit.datesWhenCompleted = newHabits
  }

  function markHabitAsStopped(habitName) {
    const habitByName = habits.value.find((h) => h.name === habitName)
    if (!habitByName?.isStopped) {
      habitByName.isStopped = false
    }
    habitByName.isStopped = !habitByName.isStopped
  }

  function addHabitCreationDate(habit) {
    const habitByName = habits.value.find((h) => h.name === habit.name)
    if (!habitByName.creationDate) {
      const today = new Date().toISOString().split('T')[0]
      habitByName.creationDate = today
    }
  }

  function addNewHabit(habitName) {
    if (isHabitExist(habitName)) return
    habits.value.push({ name: habitName })
    addHabitCreationDate(habits.value[habits.value.length - 1])
  }

  const isHabitDisabled = (habit) => habit.isStopped && isSelectedDayIsToday.value

  const isHabitChecked = (habit) => {
    const habitByName = habits.value.find((h) => h.name === habit.name)
    const isCompleted = habitByName?.datesWhenCompleted?.includes(formattedDate.value)
    return isCompleted
  }

  function toggleCompletion(habit) {
    const habitByName = habits.value.find((h) => h.name === habit.name)
    if (!habitByName?.datesWhenCompleted) {
      habitByName.datesWhenCompleted = []
    }

    if (isHabitChecked(habit)) {
      removeHabitCompletion(habitByName.name, formattedDate.value)
    } else {
      habitByName.datesWhenCompleted.push(formattedDate.value)
    }
  }

  return {
    habits,
    isHabitExist,
    removeHabit,
    stopHabitStartingToday,
    editHabitName,
    removeHabitCompletion,
    markHabitAsStopped,
    addNewHabit,
    isHabitDisabled,
    isHabitChecked,
    toggleCompletion
  }
}

export default useHabits
