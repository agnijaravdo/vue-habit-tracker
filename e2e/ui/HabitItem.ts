import { expect, type Locator, type Page, test } from '@playwright/test'

export class HabitItem {
  readonly page: Page

  readonly mainHabitsListItem: Locator
  readonly habitCheckbox: Locator

  constructor(page: Page) {
    this.page = page

    this.mainHabitsListItem = page.getByTestId('main_habits_list_item')
    this.habitCheckbox = page.locator('input[type="checkbox"]')
  }

  async assertHabitIsVisibleInMainList(habitName: string) {
    await test.step(`Assert habit ${habitName} is visible in main list`, async () => {
      await expect(
        this.mainHabitsListItem,
        'Expected habit item to be visible in main page list when drawer is closed'
      ).toHaveText(habitName)
    })
  }

  async assertHabitCheckboxIsDisabled() {
    await test.step(`Assert habit checkbox is disabled`, async () => {
      await expect(
        this.mainHabitsListItem.locator(this.habitCheckbox),
        'Expected habit item checkbox to be disabled'
      ).toBeDisabled()
    })
  }
}
