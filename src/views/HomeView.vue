<script setup>
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import useCalendar from '../store/calendar'
import { useStore } from '../store'
import DateSlider from '../components/DateSlider.vue'
import AppHeader from '../components/AppHeader.vue'
import HabitDrawer from '../components/HabitDrawer.vue'
import EmptyState from '../components/EmptyState.vue'
import AppFooter from '../components/AppFooter.vue'
import DailyHabitsList from '../components/DailyHabitsList.vue'

const store = useStore()
const { isSelectedDayAFutureDate } = useCalendar()
const drawerVisible = ref(false)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader @toggle-drawer="drawerVisible = !drawerVisible" />
    <HabitDrawer v-model:visible="drawerVisible" />

    <div class="flex-1 overflow-y-auto p-10">
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
    </div>
    <AppFooter />
  </div>
</template>
