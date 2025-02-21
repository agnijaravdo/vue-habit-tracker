import { computed, watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from './store'
import { isValidDate, formatDate, calculateWeekDays } from '../utils/dateUtil'

const isSelectedDayIsToday = ref(
  store.dateDisplay.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
)

function useCalendar() {
  const route = useRoute()
  const router = useRouter()
  let isInternalUpdate = false

  const normalizedDisplayDate = computed(() => {
    const normalizedDate = new Date(store.dateDisplay)
    normalizedDate.setHours(0, 0, 0, 0)
    return normalizedDate
  })

  const isSelectedDayAFutureDate = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(store.dateDisplay)
    selectedDate.setHours(0, 0, 0, 0)
    return selectedDate > today
  })

  const selectDate = (date: Date) => {
    store.dateDisplay = new Date(date)
    store.currentWeekOffset = 0
  }

  const days = computed(() => calculateWeekDays(store.dateDisplay, store.currentWeekOffset))
  const formattedDate = computed(() => formatDate(store.dateDisplay))

  const initializeDateBasedOnRoute = () => {
    const initialDay = route.params.day
    console.log('initialDay', initialDay)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dateString = Array.isArray(initialDay) ? initialDay[0] : initialDay
    store.dateDisplay = initialDay && isValidDate(initialDay) ? new Date(dateString) : today
  }

  onMounted(initializeDateBasedOnRoute)

  const watchRouteParams = () =>
    watch(
      () => route.params.day,
      (newDay) => {
        if (!newDay) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          isInternalUpdate = true
          store.dateDisplay = today
          return
        }

        if (isValidDate(newDay)) {
          const dateString = Array.isArray(newDay) ? newDay[0] : newDay
          const parsedDate = new Date(dateString)
          if (parsedDate.getTime() !== store.dateDisplay.getTime()) {
            isInternalUpdate = true
            store.dateDisplay = parsedDate
          }
        }
      },
      { immediate: true }
    )

  const watchDateDisplay = () =>
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

  watchRouteParams()
  watchDateDisplay()

  return {
    days,
    normalizedDisplayDate,
    isSelectedDayAFutureDate,
    selectDate,
    formattedDate,
    isSelectedDayIsToday
  }
}

export default useCalendar
