<script setup>
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import useCalendar from '../store/calendar'
import store from '../store/store'
import DateSlider from '../components/DateSlider.vue'
import HabitDrawer from '../components/HabitDrawer/HabitDrawer.vue'
import EmptyState from '../components/EmptyState.vue'
import DailyHabitsList from '../components/DailyHabitsList/DailyHabitsList.vue'

const { isSelectedDayAFutureDate, selectDate } = useCalendar()
</script>

<template>
  <HabitDrawer v-model:visible="store.isDrawerVisible" />
  <div class="w-full max-w-7xl mx-auto px-10">
    <div class="px-4 flex justify-between mb-4">
      <Button
        label="Today"
        severity="secondary"
        @click="selectDate(new Date())"
        aria-label="Select today"
      />
      <DatePicker
        v-model="store.dateDisplay"
        showIcon
        :showOnFocus="false"
        aria-label="Select a date"
      />
    </div>
    <DateSlider />
    <div v-if="isSelectedDayAFutureDate">
      <EmptyState
        text="You cannot mark habits for future dates, please select a past or current date."
        iconName="pi-exclamation-circle"
      />
    </div>
    <div v-else>
      <DailyHabitsList />
    </div>
  </div>
</template>
