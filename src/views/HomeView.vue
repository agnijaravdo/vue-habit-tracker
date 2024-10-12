<script setup>
import Carousel from 'primevue/carousel'

const date = new Date()
const week = []

for (let i = 1; i <= 7; i += 1) {
  const first = date.getDate() - date.getDay() + i
  const day = new Date(date.setDate(first)).toISOString().slice(0, 10)
  const dayOfTheWeek = new Date(day).toLocaleString('default', { weekday: 'long' })
  const monthAndDay = new Date(day).toLocaleString('default', { day: 'numeric', month: 'short' })
  week.push({ dayOfTheWeek, monthAndDay })
}
</script>

<template>
  <div class="flex h-screen">
    <div class="w-1/4 p-4">
      <div class="font-medium mb-4">Overall Habit List:</div>
      <ul class="list-disc pl-6">
        <li>Drink Water</li>
        <li>Exercise</li>
      </ul>
    </div>

    <div class="w-3/4 p-4">
      <div class="px-20 width: 500px">
        <Carousel :value="week" :numVisible="7" :numScroll="7">
          <template #item="day">
            <div
              class="size-24 border border-gray-20 rounded justify-center flex items-center text-center"
            >
              <div class="font-medium whitespace-pre-wrap">
                {{ `${day.data.dayOfTheWeek},\n${day.data.monthAndDay}` }}
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles here */
</style>
