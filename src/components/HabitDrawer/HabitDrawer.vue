<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import EmojiPicker from 'vue3-emoji-picker'
import ConfirmPopup from 'primevue/confirmpopup'
import useConfirmHandlers from './useConfirmHandlers'
import useHabits from '../../store/habits'

const visible = ref(false)
const newHabit = ref('')
const inputValid = ref(true)
const showEmojiPicker = ref(false)
const editStates = ref({})
const valueToEdit = ref('')

const emit = defineEmits(['update:visible'])
const onDrawerClose = () => {
  emit('update:visible', false)
  inputValid.value = true
  showEmojiPicker.value = false
  editStates.value = {}
}

const { addNewHabit, editHabitName, markHabitAsStopped, isHabitExist, habits } = useHabits()
const { confirmDelete, confirmStop } = useConfirmHandlers()

const habitsList = habits.value

const toggleEmojiPicker = (habitName = null) => {
  showEmojiPicker.value = !showEmojiPicker.value
  valueToEdit.value = habitName
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
  if (valueToEdit.value) {
    editStates.value[valueToEdit.value].newName += emoji.i
  } else {
    newHabit.value += emoji.i
  }
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
}
</script>

<template>
  <Drawer :visible="visible" @update:visible="onDrawerClose" position="right" class="lg:!w-[25rem]">
    <template #header>
      <div class="flex justify-between items-center p-2">
        <h1 class="text-2xl font-bold">Tracked Habits</h1>
      </div>
    </template>
    <TransitionGroup
      name="list"
      tag="ul"
      class="w-full"
      enter-active-class="transition-all duration-500 ease"
      leave-active-class="transition-all duration-500 ease"
      enter-from-class="opacity-0 transform translate-x-8"
      enter-to-class="opacity-100 transform translate-x-0"
      leave-from-class="opacity-100 transform translate-x-0"
      leave-to-class="opacity-0 transform translate-x-8"
    >
      <li
        v-for="habit of habitsList"
        :key="habit.name"
        :class="[
          'flex justify-between items-center border-b border-gray-300 py-2',
          habit.isStopped ? 'text-red-500' : 'text-inherit'
        ]"
      >
        <div class="flex-1 flex items-center">
          <template v-if="editStates[habit.name]?.isEditing">
            <InputGroup>
              <InputText
                v-model="editStates[habit.name].newName"
                id="edit-habit"
                placeholder="Edit Your Habit"
                class="flex-grow border border-blue-500 outline-none focus:ring-2 focus:border-blue-500 mr-2"
                @keyup.enter="saveHabit(habit)"
                @input="inputValid = true"
              />
              <InputGroupAddon>
                <Button
                  icon="pi pi-face-smile"
                  @click="toggleEmojiPicker(habit.name)"
                  severity="secondary"
                />
              </InputGroupAddon>
            </InputGroup>
          </template>
          <template v-else>
            <span
              :class="[
                'flex-grow',
                'text-left',
                'cursor-default',
                'break-all',
                habit.isStopped ? 'line-through' : ''
              ]"
              >{{ habit.name }}
            </span>
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
            severity="primary"
            class="p-button-text"
          />
          <div>
            <ConfirmPopup />
            <Button
              v-if="habit.isStopped"
              icon="pi pi-play"
              @click="markHabitAsStopped(habit.name)"
              title="Enable habit back"
              severity="primary"
              class="p-button-text"
            />
            <Button
              v-else
              icon="pi pi-stop"
              @click="confirmStop(habit.name)"
              title="Stop habit from today"
              severity="secondary"
              class="p-button-text"
            />
          </div>
          <ConfirmPopup />
          <Button
            icon="pi pi-trash"
            @click="confirmDelete(habit.name)"
            title="Remove habit"
            severity="danger"
            class="p-button-text"
          />
        </div>
      </li>
    </TransitionGroup>
    <div class="mt-4 space-y-3">
      <div class="max-w-full">
        <InputGroup>
          <InputText
            v-model="newHabit"
            id="new-habit"
            placeholder="Enter New Habit"
            class="flex-auto"
            @keyup.enter="addNewHabitToStoreAndClearInput"
            @input="inputValid = true"
          />
          <InputGroupAddon>
            <Button icon="pi pi-face-smile" @click="toggleEmojiPicker()" severity="secondary" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <EmojiPicker
        v-if="showEmojiPicker"
        @select="onSelectEmoji"
        disable-skin-tones
        class="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2"
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
