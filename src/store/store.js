import { reactive } from 'vue'

const store = reactive({
  currentWeekOffset: 0,
  dateDisplay: new Date()
})

export default store
