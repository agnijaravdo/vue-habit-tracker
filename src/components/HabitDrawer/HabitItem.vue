<script setup>
import { ref } from 'vue'
import { Button, InputText, InputGroup, InputGroupAddon, ConfirmPopup } from 'primevue'
import EmojiPicker from 'vue3-emoji-picker'

const { habit, showEmojiPicker, isEditing } = defineProps([
  'habit',
  'showEmojiPicker',
  'isEditing',
  'newName'
])

const emit = defineEmits([
  'toggleEditing',
  'saveHabit',
  'markHabitAsStopped',
  'confirmStop',
  'confirmDelete',
  'toggleEmojiPicker',
  'onSelectEmoji',
  'update:inputValid'
])

const newName = ref(habit.name)

const toggleEditing = () => {
  emit('toggleEditing', habit)
}

const saveHabit = () => {
  emit('saveHabit', { habit, newName: newName.value })
}

const toggleEmojiPicker = () => {
  emit('toggleEmojiPicker', habit.name, 'edit')
}

const onEmojiSelect = (emoji) => {
  newName.value += emoji.i
  emit('onSelectEmoji', emoji)
}
</script>

<template>
  <li
    :class="[
      'flex justify-between items-center border-b border-gray-300 py-2',
      habit.isStopped ? 'text-red-500' : 'text-inherit'
    ]"
  >
    <div class="flex-1 flex items-center">
      <template v-if="isEditing">
        <div class="relative">
          <InputGroup>
            <InputText
              v-model="newName"
              id="edit-habit"
              placeholder="Edit Your Habit"
              class="flex-grow border border-blue-500 outline-none focus:ring-2 focus:border-blue-500 mr-2"
              @keyup.enter="saveHabit"
              @input="$emit('update:inputValid', true)"
            />
            <InputGroupAddon>
              <Button icon="pi pi-face-smile" @click="toggleEmojiPicker" severity="secondary" />
            </InputGroupAddon>
          </InputGroup>
          <EmojiPicker
            v-if="showEmojiPicker.status && showEmojiPicker.position === 'edit'"
            @select="onEmojiSelect"
            disable-skin-tones
            class="absolute z-10 top-full left-0 mt-2"
          />
        </div>
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
        >
          {{ habit.name }}
        </span>
      </template>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <Button
        icon="pi pi-pencil"
        v-if="!isEditing"
        @click="toggleEditing"
        title="Edit habit name"
        severity="secondary"
        class="p-button-text"
      />
      <Button
        icon="pi pi-check"
        v-else
        @click="saveHabit"
        title="Save new habit name"
        severity="primary"
        class="p-button-text"
      />
      <div>
        <ConfirmPopup />
        <Button
          v-if="habit.isStopped"
          icon="pi pi-play"
          @click="$emit('markHabitAsStopped', habit.name)"
          title="Enable habit back"
          severity="primary"
          class="p-button-text"
        />
        <Button
          v-else
          icon="pi pi-stop"
          @click="$emit('confirmStop', habit.name)"
          title="Stop habit from today"
          severity="secondary"
          class="p-button-text"
        />
      </div>
      <ConfirmPopup />
      <Button
        icon="pi pi-trash"
        @click="$emit('confirmDelete', habit.name)"
        title="Remove habit"
        severity="danger"
        class="p-button-text"
      />
    </div>
  </li>
</template>
