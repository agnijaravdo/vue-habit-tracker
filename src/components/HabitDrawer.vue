<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import EmojiPicker from 'vue3-emoji-picker'
import {
  isHabitExist,
  addNewHabit,
  removeHabit,
  editHabitName,
  getListOfHabits
} from '../store/habitsList'

const visible = ref(false)
const newHabit = ref('')
const inputValid = ref(true)
const showEmojiPicker = ref(false)
const editStates = ref({})

const emit = defineEmits(['update:visible'])
const onDrawerClose = () => {
  emit('update:visible', false)
  inputValid.value = true
  showEmojiPicker.value = false
  editStates.value = {}
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

const toggleEditing = (habit) => {
  if (!editStates.value[habit.name]) {
    editStates.value[habit.name] = { isEditing: false, newName: habit.name }
  }
  editStates.value[habit.name].isEditing = !editStates.value[habit.name].isEditing
}

const saveHabit = (habit) => {
  const { newName } = editStates.value[habit.name]
  if (newName && newName !== habit.name && !isHabitExist(newName)) {
    editHabitName(habit.name, newName)
  }
  editStates.value[habit.name].isEditing = false
}
</script>

<template>
  <Drawer :visible="visible" @update:visible="onDrawerClose" position="right" class="lg:!w-[25rem]">
    <template #header>
      <div class="flex justify-between items-center p-2">
        <h1 class="text-2xl font-bold">Tracked Habits</h1>
      </div>
    </template>
    <TransitionGroup name="list" tag="ul" class="w-full">
      <li
        v-for="habit of getListOfHabits()"
        :key="habit.name"
        class="flex justify-between items-center border-b border-gray-300 py-2"
      >
        <div class="flex-1 flex items-center">
          <template v-if="editStates[habit.name]?.isEditing">
            <input
              v-model="editStates[habit.name].newName"
              class="flex-grow border border-blue-500 outline-none focus:ring-2 focus:border-blue-500 mr-2"
              @keyup.enter="saveHabit(habit)"
            />
          </template>
          <template v-else>
            <span class="flex-grow text-left cursor-default break-all">{{ habit.name }}</span>
          </template>
        </div>
        <div class="flex items-center justify-end space-x-2">
          <Button
            icon="pi pi-pencil"
            v-if="!editStates[habit.name]?.isEditing"
            @click="toggleEditing(habit)"
            title="Edit habit name"
            severity="secondary"
            class="p-button-text"
          />
          <Button
            icon="pi pi-check"
            v-else
            @click="saveHabit(habit)"
            title="Save new habit name"
            severity="secondary"
            class="p-button-text"
            style="color: green"
          />
          <Button
            icon="pi pi-trash"
            @click="removeHabit(habit.name)"
            title="Remove habit"
            severity="secondary"
            class="p-button-text"
          />
        </div>
      </li>
    </TransitionGroup>
    <div class="mt-4 space-y-3 pr-4">
      <div class="flex space-x-1" style="max-width: 100%">
        <InputText
          v-model="newHabit"
          id="new-habit"
          placeholder="Enter New Habit"
          class="flex-auto"
          @keyup.enter="addNewHabitToStoreAndClearInput"
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
        class="w-full"
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

li {
  list-style-type: none;
}
</style>
