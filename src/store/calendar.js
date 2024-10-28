import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isValidDate, getStartOfWeek, formatDate } from '../utils/dateUtil'
import { useStore } from '../store'

function useCalendar() {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const paramsDay = isValidDate(route.params.day) ? new Date(route.params.day) : null

  //   if (paramsDay) {
  //     store.dateDisplay = paramsDay
  //   } else {
  //     store.dateDisplay = new Date()
  //   }

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
    store.dateDisplay = new Date(date)
    store.currentWeekOffset = 0
  }

  const calculateWeekDays = (offset) => {
    const startOfWeek = getStartOfWeek(paramsDay ? store.dateDisplay : new Date())
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

  const days = computed(() =>
    calculateWeekDays(store.currentWeekOffset, paramsDay, store.dateDisplay)
  )

  const formattedDate = computed(() => formatDate(store.dateDisplay))

  watch(
    () => store.dateDisplay,
    (newDate, oldDate) => {
      if (newDate.getTime() !== oldDate.getTime()) {
        const today = new Date()
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        const newDateNormalized = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate()
        )

        if (newDateNormalized.getTime() !== todayNormalized.getTime()) {
          router.push({ name: 'day', params: { day: formatDate(newDate) } })
        }
      }
    }
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
