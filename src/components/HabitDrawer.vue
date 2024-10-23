<script setup>
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import { defineProps, defineEmits, ref } from 'vue'

import { addNewHabit, removeHabit, getListOfHabits, getNextHabitId } from '../store/habits'

defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const onDrawerClose = () => {
  emit('update:visible', false)
}

const newHabit = ref(null)

const addNewHabitToStore = () => {
  if (newHabit.value) {
    addNewHabit({
      id: getNextHabitId(),
      name: newHabit.value
    })
    newHabit.value = ''
  }
}
</script>

<template>
  <Drawer :visible="visible" @update:visible="onDrawerClose" position="right">
    <template #header>
      <div class="flex justify-between items-center p-2">
        <h1 class="text-2xl font-bold">Tracked Habits</h1>
      </div>
    </template>
    <TransitionGroup name="list" tag="ul">
      <li v-for="habit of getListOfHabits()" :key="habit.id">
        <div class="flex justify-between items-center p-2">
          <span>{{ habit.name }}</span>
          <Button
            icon="pi pi-trash"
            @click="removeHabit(habit.id)"
            severity="secondary"
            class="p-button-text"
          ></Button>
        </div>
      </li>
      <br v-if="getListOfHabits().length === 0" />
    </TransitionGroup>
    <div class="mt-4">
      <InputGroup class="flex items-center">
        <InputText
          v-model="newHabit"
          id="new-habit"
          placeholder="Enter New Habit"
          class="flex-1"
          v-on:keyup.enter="addNewHabitToStore"
        />
        <Button icon="pi pi-plus" severity="success" @click="addNewHabitToStore" />
      </InputGroup>
    </div>
  </Drawer>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

ul {
  width: 52rem;
}

li {
  list-style-type: none;
  width: 33%;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}
</style>
