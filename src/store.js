import { reactive } from 'vue'

export const store = reactive({
  currentWeekOffset: 0,
  dateDisplay: new Date()
})

export function useStore() {
  return store
}
