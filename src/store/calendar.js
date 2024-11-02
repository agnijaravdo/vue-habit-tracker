import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidDate, getStartOfWeek, formatDate } from '../utils/dateUtil'
import { useStore } from '../store'

function useCalendar() {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const normalizedDisplayDate = computed(() => {
    const normalizedDate = new Date(store.dateDisplay)
    normalizedDate.setHours(0, 0, 0, 0)
    return normalizedDate
  })

  const isSelectedDayAFutureDate = computed(() => {
    const today = new Date()
    const selectedDate = new Date(store.dateDisplay)
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)
    return selectedDate > today
  })

  const selectDate = (date) => {
    store.dateDisplay = date
    store.currentWeekOffset = 0
  }

  const calculateWeekDays = (offset) => {
    const startOfWeek = getStartOfWeek(store.dateDisplay)
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

  const days = computed(() => calculateWeekDays(store.currentWeekOffset))
  const formattedDate = computed(() => formatDate(store.dateDisplay))

  let isInternalUpdate = false

  watch(
    () => store.dateDisplay,
    (newDate, oldDate) => {
      if (isInternalUpdate) {
        isInternalUpdate = false
        return
      }

      if (newDate.getTime() !== oldDate.getTime()) {
        isInternalUpdate = true
        router.push({ name: 'day', params: { day: formatDate(newDate) } })
      }
    }
  )

  watch(
    () => route.params.day,
    (newDay) => {
      if (newDay && isValidDate(newDay)) {
        const parsedDate = new Date(newDay)
        if (parsedDate.getTime() !== store.dateDisplay.getTime()) {
          isInternalUpdate = true
          store.dateDisplay = parsedDate
        }
      }
    },
    { immediate: true }
  )

  return {
    days,
    normalizedDisplayDate,
    isSelectedDayAFutureDate,
    selectDate,
    formattedDate
  }
}

export default useCalendar
