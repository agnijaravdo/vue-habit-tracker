import { test } from '@playwright/test'
import { HabitDrawer } from './ui/HabitDrawer'
import { HabitItem } from './ui/HabitItem'

const HABIT_NAME = 'Test habit'
const EDITED_HABIT_NAME = 'Edited habit'

test.describe('Habit Actions Tests', () => {
  let habitDrawer: HabitDrawer
  let habitItem: HabitItem

  test.beforeEach(async ({ page }) => {
    habitDrawer = new HabitDrawer(page)
    habitItem = new HabitItem(page)

    await page.goto('/')
    await habitDrawer.openHabitsDrawer()
  })

  test('Test if the adding habit in drawer works', async () => {
    await habitDrawer.addHabit(HABIT_NAME)
  })

  test('Test if the deleting habit in drawer works', async () => {
    await habitDrawer.addHabit(HABIT_NAME)
    await habitDrawer.deleteHabit(HABIT_NAME)
  })

  test('Test if the editing habit in drawer works', async () => {
    await habitDrawer.addHabit(HABIT_NAME)
    await habitDrawer.editHabit(HABIT_NAME, EDITED_HABIT_NAME)
  })

  test('Test if new habit is visible when habit drawer is closed', async () => {
    await habitDrawer.addHabit(HABIT_NAME)
    await habitDrawer.closeHabitsDrawer()
    await habitItem.assertHabitIsVisibleInMainList(HABIT_NAME)
  })

  test('Test if habit checking is disabled when habit is stopped', async () => {
    await habitDrawer.addHabit(HABIT_NAME)
    await habitDrawer.stopHabit()
    await habitDrawer.closeHabitsDrawer()
    await habitItem.assertHabitCheckboxIsDisabled()
  })
})
