const isValidDate = (dateString) => {
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime())
}

const getStartOfWeek = (date) => {
  const weekDate = new Date(date)
  const dayOfWeek = weekDate.getDay() || 7
  weekDate.setHours(0, 0, 0, 0)
  const difference = weekDate.getDate() - dayOfWeek + 1
  return new Date(weekDate.setDate(difference))
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export { isValidDate, getStartOfWeek, formatDate }
