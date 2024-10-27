import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidDate, getStartOfWeek, formatDate, calculateWeekDays } from '../utils/dateUtil'

function useCalendar() {
  const route = useRoute()
  const router = useRouter()

  const currentWeekOffset = ref(0)
  const paramsDay = isValidDate(route.params.day) ? new Date(route.params.day) : null
  const dateDisplay = ref(paramsDay || new Date())

  const days = computed(() =>
    calculateWeekDays(currentWeekOffset.value, paramsDay, dateDisplay.value)
  )

  const normalizedDisplayDate = computed(() => {
    const normalizedDate = new Date(dateDisplay.value)
    normalizedDate.setHours(0, 0, 0, 0)
    return normalizedDate
  })

  const isSelectedDayAFutureDate = computed(() => {
    const today = new Date()
    const selectedDate = new Date(dateDisplay.value)
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    return selectedDate > today
  })

  const selectDate = (date) => {
    dateDisplay.value = new Date(date)
  }

  watch(dateDisplay, (newDate, oldDate) => {
    if (newDate.getTime() !== oldDate.getTime()) {
      const startOfCurrWeek = getStartOfWeek(new Date())
      const startOfNewWeek = getStartOfWeek(newDate)
      const diffWeeks = Math.round((startOfNewWeek - startOfCurrWeek) / (1000 * 60 * 60 * 24 * 7))
      currentWeekOffset.value = diffWeeks
      router.push({ name: 'day', params: { day: formatDate(newDate) } })
    }
  })

  return {
    currentWeekOffset,
    dateDisplay,
    days,
    normalizedDisplayDate,
    isSelectedDayAFutureDate,
    selectDate
  }
}

export default useCalendar
