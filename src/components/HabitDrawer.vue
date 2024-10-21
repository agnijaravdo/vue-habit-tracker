<script setup>
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
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
    <DataTable :value="getListOfHabits()" class="mt-1">
      <Column field="name"></Column>
      <Column class="!text-right">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            @click="removeHabit(data.id)"
            severity="secondary"
            class="p-button-text"
          ></Button>
        </template>
      </Column>
    </DataTable>
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
