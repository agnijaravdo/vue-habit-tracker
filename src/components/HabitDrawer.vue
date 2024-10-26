<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import EmojiPicker from 'vue3-emoji-picker'

import { addNewHabit, removeHabit, getListOfHabits, getNextHabitId } from '../store/habitsList'

const visible = ref(false)
const emit = defineEmits(['update:visible'])
const onDrawerClose = () => {
  emit('update:visible', false)
}

const newHabit = ref('')
const showEmojiPicker = ref(false)

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const addNewHabitToStore = () => {
  if (newHabit.value) {
    addNewHabit({
      id: getNextHabitId(),
      name: newHabit.value,
      isDone: false
    })
    newHabit.value = ''
  }
}

const onSelectEmoji = (emoji) => {
  newHabit.value += emoji.i
  showEmojiPicker.value = false
}
</script>

<template>
  <Drawer :visible="visible" @update:visible="onDrawerClose" position="right">
    <template #header>
      <div class="flex justify-between items-center p-2">
        <h1 class="text-2xl font-bold">Tracked Habits</h1>
      </div>
    </template>
    <div class="scrollable-content">
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
      </TransitionGroup>
      <div class="mt-4 space-y-3">
        <div class="flex mb-2 space-x-1" style="width: 105%">
          <InputText
            v-model="newHabit"
            id="new-habit"
            placeholder="Enter New Habit"
            class="flex-auto"
            v-on:keyup.enter="addNewHabitToStore"
          />
          <Button icon="pi pi-face-smile" @click="toggleEmojiPicker" severity="secondary" />
        </div>
        <EmojiPicker
          v-if="showEmojiPicker"
          @select="onSelectEmoji"
          style="position: absolute; z-index: 1000; top: 240px; left: 0"
        />
        <Button
          icon="pi pi-plus"
          label="Add new habit"
          severity="success"
          @click="addNewHabitToStore"
          style="width: 105%"
        />
      </div>
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

.scrollable-content {
  max-height: 100vh;
  overflow-y: auto;
  padding-right: 1rem;
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
