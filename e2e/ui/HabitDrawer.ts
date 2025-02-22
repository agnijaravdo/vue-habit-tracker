import { expect, type Locator, type Page, test } from '@playwright/test'

export class HabitDrawer {
  readonly page: Page

  readonly habitsListButton: Locator
  readonly trackedHabits: Locator
  readonly newHabitInput: Locator
  readonly addHabitButton: Locator
  readonly habitItem: (text?: string) => Locator
  readonly editHabitButton: Locator
  readonly editHabitInput: Locator
  readonly saveHabitButton: Locator
  readonly deleteHabitButton: Locator
  readonly confirmDeleteButton: Locator
  readonly closeDrawerButton: Locator
  readonly stopHabitButton: Locator
  readonly confirmStopButton: Locator

  constructor(page: Page) {
    this.page = page

    this.habitsListButton = page.getByLabel('Your habits list')
    this.trackedHabits = page.getByTestId('tracked_habits')
    this.newHabitInput = page.getByPlaceholder('Enter New Habit')
    this.addHabitButton = page.getByRole('button', { name: 'Add new habit' })
    this.habitItem = (text?: string) =>
      text
        ? page.getByTestId('habit_item').getByText(text, { exact: true })
        : page.getByTestId('habit_item')
    this.editHabitButton = page.getByTestId('edit_habit')
    this.editHabitInput = page.getByPlaceholder('Edit Your Habit')
    this.saveHabitButton = page.getByTestId('save_new_habit_name')
    this.deleteHabitButton = page.getByTestId('delete_habit')
    this.confirmDeleteButton = page.getByRole('button', { name: 'Delete' }).nth(1)
    this.closeDrawerButton = page.getByRole('button', { name: 'Close' })
    this.stopHabitButton = page.getByTestId('stop_habit')
    this.confirmStopButton = page.getByRole('button', { name: 'Stop the habit' }).nth(1)
  }

  async openHabitsDrawer() {
    await test.step(`Open habits drawer and assert if it's visible`, async () => {
      await this.habitsListButton.click()
      await expect(this.trackedHabits, 'Expect drawer title to be visible').toBeVisible()
    })
  }

  async addHabit(habitName: string) {
    await test.step(`Add habit ${habitName} and assert if it's visible`, async () => {
      await this.newHabitInput.fill(habitName)
      await this.addHabitButton.click()
      await expect(this.habitItem(habitName), 'Expected habit item to be visible').toBeVisible()
    })
  }

  async editHabit(oldHabitName: string, newHabitName: string) {
    await test.step(`Edit habit ${oldHabitName} to ${newHabitName} and assert if it's visible`, async () => {
      await this.editHabitButton.click()
      await this.editHabitInput.fill(newHabitName)
      await this.saveHabitButton.click()
      await expect(this.habitItem(newHabitName), 'Expected habit item to be edited').toBeVisible()
      await expect(this.habitItem(), 'Expected only one habit item').toHaveCount(1)
    })
  }

  async deleteHabit(habitName: string) {
    await test.step(`Delete habit ${habitName} and assert if it's removed`, async () => {
      await this.deleteHabitButton.click()
      await this.confirmDeleteButton.click()
      await expect(this.habitItem(habitName), 'Expected habit item to be removed').not.toBeVisible()
    })
  }

  async closeHabitsDrawer() {
    await test.step(`Close habits drawer`, async () => {
      await this.closeDrawerButton.click()
    })
  }

  async stopHabit() {
    await test.step(`Stop the habit`, async () => {
      await this.stopHabitButton.click()
      await this.confirmStopButton.click()
    })
  }
}
