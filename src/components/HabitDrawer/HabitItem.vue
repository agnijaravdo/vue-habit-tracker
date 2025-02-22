<script setup lang="ts">
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

const onEmojiSelect = (emoji: { i: string }) => {
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
              id="edit-habit"
              v-model="newName"
              placeholder="Edit Your Habit"
              class="flex-grow border border-blue-500 outline-none focus:ring-2 focus:border-blue-500 mr-2"
              @keyup.enter="saveHabit"
              @input="$emit('update:inputValid', true)"
            />
            <InputGroupAddon>
              <Button icon="pi pi-face-smile" severity="secondary" @click="toggleEmojiPicker" />
            </InputGroupAddon>
          </InputGroup>
          <EmojiPicker
            v-if="showEmojiPicker.status && showEmojiPicker.position === 'edit'"
            disable-skin-tones
            class="absolute z-10 top-full left-0 mt-2"
            @select="onEmojiSelect"
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
        v-if="!isEditing"
        icon="pi pi-pencil"
        title="Edit habit name"
        severity="secondary"
        class="p-button-text"
        data-testid="edit_habit"
        @click="toggleEditing"
      />
      <Button
        v-else
        icon="pi pi-check"
        title="Save new habit name"
        severity="primary"
        class="p-button-text"
        data-testid="save_new_habit_name"
        @click="saveHabit"
      />
      <div>
        <ConfirmPopup />
        <Button
          v-if="habit.isStopped"
          icon="pi pi-play"
          title="Enable habit back"
          severity="primary"
          class="p-button-text"
          @click="$emit('markHabitAsStopped', habit.name)"
        />
        <Button
          v-else
          icon="pi pi-stop"
          title="Stop habit from today"
          severity="secondary"
          class="p-button-text"
          data-testid="stop_habit"
          @click="$emit('confirmStop', habit.name)"
        />
      </div>
      <ConfirmPopup />
      <Button
        icon="pi pi-trash"
        title="Remove habit"
        severity="danger"
        class="p-button-text"
        data-testid="delete_habit"
        @click="$emit('confirmDelete', habit.name)"
      />
    </div>
  </li>
</template>
