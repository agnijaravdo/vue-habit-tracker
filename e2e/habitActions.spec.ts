import { test, expect } from '@playwright/test'

const HABIT_NAME = 'Test habit'
const EDITED_HABIT_NAME = 'Edited habit'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Your habits list').click()
  await expect(page.getByTestId('tracked_habits'), 'Expect drawer title is visible').toBeVisible()
})

test.describe('Habit Actions Tests', () => {
  test('Test if the adding habit in drawer works', async ({ page }) => {
    await page.getByPlaceholder('Enter New Habit').fill(HABIT_NAME)
    await page.getByRole('button', { name: 'Add new habit' }).click()
    await expect(page.getByTestId('habit_item'), 'Expected habit item to be visible').toHaveText(
      HABIT_NAME
    )
  })

  test('Test if the deleting habit in drawer works', async ({ page }) => {
    await page.getByPlaceholder('Enter New Habit').fill(HABIT_NAME)
    await page.getByRole('button', { name: 'Add new habit' }).click()
    await expect(page.getByTestId('habit_item'), 'Expected habit item to be visible').toHaveText(
      HABIT_NAME
    )

    await page.getByTestId('delete_habit').click()
    await page.getByRole('button', { name: 'Delete' }).nth(1).click()
    await expect(
      page.getByTestId('habit_item'),
      'Expected habit item to be removed'
    ).not.toBeVisible()
  })

  test('Test if the editing habit in drawer works', async ({ page }) => {
    await page.getByPlaceholder('Enter New Habit').fill(HABIT_NAME)
    await page.getByRole('button', { name: 'Add new habit' }).click()
    await expect(page.getByTestId('habit_item'), 'Expected habit item to be visible').toHaveText(
      HABIT_NAME
    )

    await page.getByTestId('edit_habit').click()
    await page.getByPlaceholder('Edit Your Habit').fill(EDITED_HABIT_NAME)
    await page.getByTestId('save_new_habit_name').click()
    await expect(
      page.getByTestId('habit_item').filter({ hasText: EDITED_HABIT_NAME }),
      'Expected habit item to be edited'
    ).toHaveText(EDITED_HABIT_NAME)
    await expect(page.getByTestId('habit_item'), 'Expected only one habit item').toHaveCount(1)
  })

  test('Test if new habit is visible when habitDrawer is closed', async ({ page }) => {
    await page.getByPlaceholder('Enter New Habit').fill(HABIT_NAME)
    await page.getByRole('button', { name: 'Add new habit' }).click()
    await expect(page.getByTestId('habit_item'), 'Expected habit item to be visible').toHaveText(
      HABIT_NAME
    )

    await page.getByRole('button', { name: 'Close' }).click()
    await expect(
      page.getByTestId('main_habits_list_item'),
      'Expected habit item to be visible in main page list when drawer is closed'
    ).toHaveText(HABIT_NAME)
  })

  test('Test if habit checking is disabled when habit is stopped', async ({ page }) => {
    await page.getByPlaceholder('Enter New Habit').fill(HABIT_NAME)
    await page.getByRole('button', { name: 'Add new habit' }).click()
    await expect(page.getByTestId('habit_item'), 'Expected habit item to be visible').toHaveText(
      HABIT_NAME
    )

    await page.getByTestId('stop_habit').click()
    await page.getByRole('button', { name: 'Stop the habit' }).nth(1).click()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(
      page.getByTestId('main_habits_list_item').locator('input[type="checkbox"]'),
      'Expected habit item checkbox to be disabled'
    ).toBeDisabled()
  })
})
