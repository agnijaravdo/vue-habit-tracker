<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import useCalendar from '@store/calendar'
import store from '@store/store'
import DateSlider from '@components/DateSlider.vue'
import HabitDrawer from '@components/HabitDrawer/HabitDrawer.vue'
import EmptyState from '@components/EmptyState.vue'
import DailyHabitsList from '@components/DailyHabitsList/DailyHabitsList.vue'

const { isSelectedDayAFutureDate, selectDate } = useCalendar()
</script>

<template>
  <HabitDrawer v-model:visible="store.isDrawerVisible" />
  <div class="w-full max-w-7xl mx-auto px-10">
    <section class="flex justify-between mb-4 gap-2" aria-label="Date selection actions buttons">
      <Button
        label="Today"
        severity="secondary"
        aria-label="Select today"
        @click="selectDate(new Date())"
      />
      <DatePicker
        v-model="store.dateDisplay"
        showIcon
        :showOnFocus="false"
        aria-label="Select a date"
      />
    </section>
    <section aria-label="Date slider">
      <DateSlider />
    </section>
    <section v-if="isSelectedDayAFutureDate" aria-label="Empty state for not allowed future dates">
      <EmptyState
        text="You cannot mark habits for future dates, please select a past or current date."
        iconName="pi-exclamation-circle"
      />
    </section>
    <section v-else aria-label="Daily habits list">
      <DailyHabitsList />
    </section>
  </div>
</template>
