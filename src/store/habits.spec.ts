import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import useHabits from './habits'

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

vi.mock('./calendar', () => ({
  default: () => ({
    isSelectedDayIsToday: ref(true),
    formattedDate: ref('2025-02-15'),
    days: ref([]),
    normalizedDisplayDate: ref(new Date()),
    isSelectedDayAFutureDate: ref(false),
    selectDate: vi.fn()
  })
}))

describe('useHabits', () => {
  let habits: ReturnType<typeof useHabits>

  beforeEach(() => {
    localStorage.clear()
    habits = useHabits()
  })

  it('should habits be empty if localStorage is empty', () => {
    expect(habits.habits.value).toEqual([])
  })

  it('should add a new habit', () => {
    const habitName = 'Exercise'

    habits.addNewHabit(habitName)
    expect(habits.habits.value).toHaveLength(1)
    expect(habits.habits.value[0].name).toBe(habitName)
    expect(habits.habits.value[0].creationDate).toBeDefined()
  })

  it('should not add a duplicate habit', () => {
    const habitName = 'Exercise'

    habits.addNewHabit(habitName)
    habits.addNewHabit(habitName)
    expect(habits.habits.value).toHaveLength(1)
  })

  it('should remove a habit', () => {
    const habitName = 'Exercise'

    habits.addNewHabit(habitName)
    habits.removeHabit(habitName)
    expect(habits.habits.value).toHaveLength(0)
  })

  it('should edit a habit name', () => {
    const oldHabitName = 'Exercise'
    const newHabitName = 'Workout'

    habits.addNewHabit(oldHabitName)
    habits.editHabitName(oldHabitName, newHabitName)
    expect(habits.habits.value[0].name).toBe(newHabitName)
  })

  it('should mark a habit as stopped', () => {
    const habitName = 'Exercise'

    habits.addNewHabit(habitName)
    habits.markHabitAsStopped(habitName)
    const habit = habits.habits.value.find((h) => h.name === habitName)
    expect(habit?.isStopped).toBe(true)
  })

  it('should toggle habit completion', () => {
    const habitName = 'Exercise'

    habits.addNewHabit(habitName)
    const habit = habits.habits.value.find((h) => h.name === habitName)

    if (habit) {
      habits.toggleCompletion(habit)
      expect(habits.isHabitChecked(habit)).toBe(true)
      habits.toggleCompletion(habit)
      expect(habits.isHabitChecked(habit)).toBe(false)
    }
  })
})
