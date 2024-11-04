<script setup>
import DatePicker from 'primevue/datepicker'
import useCalendar from '../store/calendar'
import store from '../store/store'
import DateSlider from '../components/DateSlider.vue'
import HabitDrawer from '../components/HabitDrawer.vue'
import EmptyState from '../components/EmptyState.vue'
import DailyHabitsList from '../components/DailyHabitsList.vue'

const { isSelectedDayAFutureDate } = useCalendar()
</script>

<template>
  <HabitDrawer v-model:visible="store.isDrawerVisible" />
  <div class="w-full max-w-7xl mx-auto px-10">
    <div class="flex justify-end mb-4">
      <DatePicker v-model="store.dateDisplay" showIcon :showOnFocus="false" />
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
