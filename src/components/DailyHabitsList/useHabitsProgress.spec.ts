import { expect, it } from 'vitest'
import useHabitsProgress from './useHabitsProgress'
import { Habit } from '@/store/habits'

it('should return 0 when there are no active habits', () => {
  const habits = { value: [] }
  const isSelectedDayIsToday = { value: true }
  const isHabitChecked = () => true

  const { habitsProgress } = useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked)

  expect(habitsProgress.value).toBe(0)
})

it('should return 50 when half of the active habits are completed', () => {
  const habits = { value: [{ name: 'habit1' }, { name: 'habit2' }] }
  const isSelectedDayIsToday = { value: true }
  const isHabitChecked = (habit: Habit) => habit.name === 'habit1'

  const { habitsProgress } = useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked)

  expect(habitsProgress.value).toBe(50)
})

it('should return 100 when all active habits are completed', () => {
  const habits = { value: [{ name: 'habit1' }, { name: 'habit2' }] }
  const isSelectedDayIsToday = { value: true }
  const isHabitChecked = (habit: Habit) => habit.name === 'habit1' || habit.name === 'habit2'

  const { habitsProgress } = useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked)

  expect(habitsProgress.value).toBe(100)
})

it('should return 100 when one habit is stopped and other is completed', () => {
  const habits = { value: [{ name: 'habit1', isStopped: true }, { name: 'habit2' }] }
  const isSelectedDayIsToday = { value: true }
  const isHabitChecked = (habit: Habit) => habit.name === 'habit2'

  const { habitsProgress } = useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked)

  expect(habitsProgress.value).toBe(100)
})

it('should return 0 when all active habits are stopped', () => {
  const habits = {
    value: [
      { name: 'habit1', isStopped: true },
      { name: 'habit2', isStopped: true }
    ]
  }
  const isSelectedDayIsToday = { value: true }
  const isHabitChecked = () => true

  const { habitsProgress } = useHabitsProgress(habits, isSelectedDayIsToday, isHabitChecked)

  expect(habitsProgress.value).toBe(0)
})
