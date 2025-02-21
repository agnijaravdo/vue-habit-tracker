<script setup lang="ts">
import { ref } from 'vue'
import { Button, InputText, InputGroup, InputGroupAddon, Drawer } from 'primevue'
import EmojiPicker from 'vue3-emoji-picker'
import useHabits from '@store/habits'
import { setError } from '@store/error'
import useConfirmHandlers from './useConfirmHandlers'
import HabitItem from './HabitItem.vue'

type EditState = {
  isEditing: boolean
  newName: string
}

type EditStates = {
  [key: string]: EditState
}

type ShowEmojiPicker = {
  status: boolean
  position: string
}

const visible = ref(false)
const newHabit = ref('')
const inputValid = ref(true)
const editStates = ref<EditStates>({})
const showEmojiPicker = ref<ShowEmojiPicker>({ status: false, position: '' })

const valueToEdit = ref('')

const emit = defineEmits(['update:visible'])
const onDrawerClose = () => {
  emit('update:visible', false)
  inputValid.value = true
  showEmojiPicker.value = { status: false, position: '' }
  editStates.value = {}
}

const { addNewHabit, editHabitName, markHabitAsStopped, isHabitExist, habits } = useHabits()
const { confirmDelete, confirmStop } = useConfirmHandlers()

const habitsList = habits.value

const toggleEmojiPicker = (habitName = '', position = '') => {
  if (showEmojiPicker.value.position !== position) {
    showEmojiPicker.value = { status: true, position }
  } else {
    showEmojiPicker.value.status = !showEmojiPicker.value.status
  }
  valueToEdit.value = habitName
}

const addNewHabitToStoreAndClearInput = () => {
  if (newHabit.value) {
    if (isHabitExist(newHabit.value.trim()) || !newHabit.value.trim()) {
      inputValid.value = false
    } else {
      addNewHabit(newHabit.value)
    }
    newHabit.value = ''
  }
}

const onSelectEmoji = (emoji: { i: string }) => {
  if (valueToEdit.value) {
    editStates.value[valueToEdit.value].newName += emoji.i
  } else {
    newHabit.value += emoji.i
  }
  showEmojiPicker.value.status = false
}

const toggleEditing = (habit: { name: string }) => {
  if (!editStates.value[habit.name]) {
    editStates.value[habit.name] = { isEditing: false, newName: habit.name }
  }
  editStates.value[habit.name].isEditing = !editStates.value[habit.name].isEditing
}
const saveHabit = ({ habit, newName }: { habit: { name: string }; newName: string }) => {
  if (newName && newName !== habit.name && !isHabitExist(newName)) {
    editHabitName(habit.name, newName)
  }
}
</script>

<template>
  <Drawer
    :visible="visible"
    position="right"
    class="lg:!w-[25rem]"
    aria-label="Add new habit sidebar"
    @update:visible="onDrawerClose"
    @click="setError(null)"
  >
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
      <HabitItem
        v-for="habit of habitsList"
        :key="habit.name"
        :habit="habit"
        :showEmojiPicker="showEmojiPicker"
        :isEditing="editStates[habit.name]?.isEditing"
        :newName="editStates[habit.name]?.newName"
        @toggleEditing="toggleEditing"
        @saveHabit="saveHabit"
        @markHabitAsStopped="markHabitAsStopped"
        @confirmStop="confirmStop"
        @confirmDelete="confirmDelete"
        @toggleEmojiPicker="toggleEmojiPicker"
        @onSelectEmoji="onSelectEmoji"
        @update:inputValid="inputValid = $event"
      />
    </TransitionGroup>
    <div class="mt-4 space-y-3">
      <div class="max-w-full relative">
        <InputGroup>
          <InputText
            id="new-habit"
            v-model="newHabit"
            placeholder="Enter New Habit"
            class="flex-auto"
            @keyup.enter="addNewHabitToStoreAndClearInput"
            @input="inputValid = true"
          />
          <InputGroupAddon>
            <Button
              icon="pi pi-face-smile"
              severity="secondary"
              @click="toggleEmojiPicker('', 'add')"
            />
          </InputGroupAddon>
        </InputGroup>
        <EmojiPicker
          v-if="showEmojiPicker.status && showEmojiPicker.position === 'add'"
          disable-skin-tones
          class="absolute z-10 top-full right-0 mt-2"
          @select="onSelectEmoji"
        />
      </div>
      <div v-if="!inputValid" class="text-red-500 text-xs">Habit already exists or is invalid</div>
      <Button
        icon="pi pi-plus"
        label="Add new habit"
        severity="success"
        class="w-full"
        @click="addNewHabitToStoreAndClearInput"
      />
    </div>
  </Drawer>
</template>
