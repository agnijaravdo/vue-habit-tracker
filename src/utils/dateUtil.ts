const isValidDate = (dateInput: string | string[]) => {
  const dateString = Array.isArray(dateInput) ? dateInput[0] : dateInput

  if (typeof dateString !== 'string') {
    return false
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/

  if (!regex.test(dateString)) {
    return false
  }
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString
}

const getStartOfWeek = (date: Date) => {
  const weekDate = new Date(date)
  const dayOfWeek = weekDate.getDay() || 7
  weekDate.setHours(0, 0, 0, 0)
  const difference = weekDate.getDate() - dayOfWeek + 1
  return new Date(weekDate.setDate(difference))
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function calculateWeekDays(dateDisplay: Date, offset: number) {
  const startOfWeek = getStartOfWeek(dateDisplay)
  startOfWeek.setDate(startOfWeek.getDate() + offset * 7)

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return {
      dayOfTheWeek: day.toLocaleString('default', { weekday: 'long' }),
      monthAndDay: day.toLocaleString('default', { day: 'numeric', month: 'short' }),
      dayFormat: new Date(day)
    }
  })
}
export { isValidDate, formatDate, calculateWeekDays }
