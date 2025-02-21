import { expect, it } from 'vitest'
import { isValidDate, formatDate, calculateWeekDays } from './dateUtil'
import { describe } from 'node:test'

describe('isValidDate', () => {
  it('should return true for valid date', () => {
    const date = '2021-12-31'
    expect(isValidDate(date)).toBe(true)
  })

  it('should return false for invalid date', () => {
    const date = '2021-12-32'
    expect(isValidDate(date)).toBe(false)
  })

  it('should return false for invalid date format', () => {
    const date = '2021/12/31'
    expect(isValidDate(date)).toBe(false)
  })
})

describe('formatDate', () => {
  it('should return formatted date', () => {
    const date = new Date('2021-12-31')
    expect(formatDate(date)).toBe('2021-12-31')
  })
})

describe('calculateWeekDays', () => {
  it('should return an array of 7 days', () => {
    const date = new Date('2025-02-17')
    const days = calculateWeekDays(date, 0)
    expect(days.length).toBe(7)
  })

  it('should return the correct day of the week', () => {
    const date = new Date('2025-02-17')
    const days = calculateWeekDays(date, 0)
    expect(days[0].dayOfTheWeek).toBe('Monday')
  })

  it('should return the correct month and day', () => {
    const date = new Date('2025-02-17')
    const days = calculateWeekDays(date, 0)
    expect(days[0].monthAndDay).toBe('Feb 17')
  })
})
