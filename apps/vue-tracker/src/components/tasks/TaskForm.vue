<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Checkbox from 'primevue/checkbox';
import { taskService } from '../../services/task.service';
import type { Task } from '../../interfaces/task.interface';

const router = useRouter();

const taskText = ref('');
const taskDate = ref<Date>(new Date());
const taskReminder = ref(false);

const cancelAddTask = () => {
  router.push('/');
};

const onSubmit = async () => {
  if (!taskText.value || !taskDate.value) {
    alert('Please fill all fields');
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    text: taskText.value,
    day: taskDate.value,
    reminder: taskReminder.value,
  };

  try {
    // Convert the task to match backend expectations (day as ISO string)
    const taskPayload = {
      ...newTask,
      day: newTask.day instanceof Date ? newTask.day.toISOString() : newTask.day,
    };
    await taskService.addTask(taskPayload as Task);
    router.push('/');
  } catch (error) {
    console.error('Failed to add task:', error);
    alert('Failed to add task. Please try again.');
  }
};
</script>

<template>
  <div class="px-6 py-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">Add New Task</h2>
    <form
      @submit.prevent="onSubmit"
      data-test-id="add-task-form"
      class="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md"
    >
      <div class="form-field">
        <label for="text" data-testid="label-task" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Task Description
        </label>
        <InputText
          id="text"
          v-model="taskText"
          type="text"
          placeholder="Enter task description"
          data-test-id="input-task"
          class="w-full"
        />
      </div>

      <div class="form-field">
        <label for="date" data-test-id="label-date" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Due Date
        </label>
        <DatePicker
          id="date"
          v-model="taskDate"
          :showIcon="true"
          appendTo="body"
          class="w-full"
          showTime
          hourFormat="12"
        />
      </div>

      <div class="form-field flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <Checkbox
          id="reminder"
          v-model="taskReminder"
          :binary="true"
          data-test-id="input-reminder"
          class="w-5 h-5"
        />
        <label
          for="reminder"
          data-test-id="label-reminder"
          class="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer"
        >
          Set Reminder
        </label>
      </div>

      <div class="flex gap-4 pt-4">
        <Button
          class="flex-1"
          data-test-id="input-cancel-task"
          label="Cancel"
          id="cancelButton"
          @click="cancelAddTask"
          severity="secondary"
          outlined
          type="button"
        />
        <Button
          class="flex-1"
          data-test-id="input-save-task"
          label="Save Task"
          id="submitButton"
          type="submit"
          severity="success"
          icon="pi pi-check"
        />
      </div>
    </form>
  </div>
</template>
