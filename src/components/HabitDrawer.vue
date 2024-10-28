<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import EmojiPicker from 'vue3-emoji-picker'
import { isHabitExist, addNewHabit, removeHabit, getListOfHabits } from '../store/habitsList'

const visible = ref(false)

const newHabit = ref('')
const inputValid = ref(true)
const showEmojiPicker = ref(false)
const emit = defineEmits(['update:visible'])
const onDrawerClose = () => {
  emit('update:visible', false)
  inputValid.value = true
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const addNewHabitToStoreAndClearInput = () => {
  if (newHabit.value) {
    if (isHabitExist(newHabit.value.trim())) {
      inputValid.value = false
    } else {
      addNewHabit(newHabit.value)
    }
    newHabit.value = ''
  }
}

const onSelectEmoji = (emoji) => {
  newHabit.value += emoji.i
  showEmojiPicker.value = false
}
</script>

<template>
  <Drawer :visible="visible" @update:visible="onDrawerClose" position="right" class="lg:!w-[25rem]">
    <template #header>
      <div class="flex justify-between items-center p-2">
        <h1 class="text-2xl font-bold">Tracked Habits</h1>
      </div>
    </template>
    <TransitionGroup name="list" tag="ul">
      <li v-for="habit of getListOfHabits()" :key="habit.name">
        <div class="flex justify-between items-center p-2">
          <span>{{ habit.name }}</span>
          <Button
            icon="pi pi-trash"
            @click="removeHabit(habit.name)"
            severity="secondary"
            class="p-button-text"
          ></Button>
        </div>
      </li>
    </TransitionGroup>
    <div class="mt-4 space-y-3 pr-4">
      <div class="flex space-x-1" style="width: 105%">
        <InputText
          v-model="newHabit"
          id="new-habit"
          placeholder="Enter New Habit"
          class="flex-auto"
          v-on:keyup="inputValid = true"
          v-on:blur="inputValid = true"
          v-on:keyup.enter="addNewHabitToStoreAndClearInput"
        />
        <Button icon="pi pi-face-smile" @click="toggleEmojiPicker" severity="secondary" />
      </div>
      <EmojiPicker
        v-if="showEmojiPicker"
        @select="onSelectEmoji"
        style="position: absolute; z-index: 1000; top: 240px; left: 0"
      />
      <div v-if="!inputValid" class="text-red-500 text-xs">Habit already exists</div>
      <Button
        icon="pi pi-plus"
        label="Add new habit"
        severity="success"
        @click="addNewHabitToStoreAndClearInput"
        style="width: 105%"
      />
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
  width: 42%;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}
</style>
