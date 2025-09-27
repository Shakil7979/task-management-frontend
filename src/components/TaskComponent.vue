<template>
  <div class="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-center mb-6">Task Manager</h1>

      <!-- Task Form -->
      <form @submit.prevent="submitTasks" class="space-y-6 bg-white p-6 rounded shadow">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          class="pb-4 mb-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-semibold">Task {{ index + 1 }}</h2>
            <button
              type="button"
              @click="removeTask(index)"
              class="text-red-500 hover:text-red-700"
              v-if="tasks.length > 1"
            >
              Remove
            </button>
          </div>

          <div class="space-y-3">
            <!-- Title -->
            <div>
              <input
                type="text"
                v-model="task.title"
                placeholder="Task Title"
                :class="['w-full border px-3 py-2 rounded focus:outline-none focus:ring-2', validationErrors[index]?.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400']"
              />
              <p v-if="validationErrors[index]?.title" class="text-red-600 text-sm mt-1">
                {{ validationErrors[index].title }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <textarea
                v-model="task.description"
                placeholder="Task Description"
                :class="['w-full border px-3 py-2 rounded focus:outline-none focus:ring-2', validationErrors[index]?.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400']"
              ></textarea>
              <p v-if="validationErrors[index]?.description" class="text-red-600 text-sm mt-1">
                {{ validationErrors[index].description }}
              </p>
            </div>

            <!-- Due Date -->
            <div>
              <input
                type="date"
                v-model="task.due_date"
                :class="['w-full border px-3 py-2 rounded focus:outline-none focus:ring-2', validationErrors[index]?.due_date ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400']"
              />
              <p v-if="validationErrors[index]?.due_date" class="text-red-600 text-sm mt-1">
                {{ validationErrors[index].due_date }}
              </p>
            </div>
          </div>
        </div>

        <!-- Add New Task -->
        <button
          type="button"
          @click="addTask"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Another Task
        </button>

        <!-- Submit -->
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Save All Tasks 
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, getCurrentInstance } from 'vue'
import axios from 'axios'

// Access global toastr
const { appContext } = getCurrentInstance()
const $toastr = appContext.config.globalProperties.$toastr

// Form data
const tasks = ref([{ title: '', description: '', due_date: '' }])
const validationErrors = ref([])

// Add task
const addTask = () => {
  tasks.value.push({ title: '', description: '', due_date: '' })
  validationErrors.value.push({})
}

// Remove task
const removeTask = (index) => {
  tasks.value.splice(index, 1)
  validationErrors.value.splice(index, 1)
}

// Submit tasks
const submitTasks = async () => {
  validationErrors.value = []

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/tasks', {
      tasks: tasks.value
    })

    // Success toastr
    $toastr.success(response.data.message, 'Success')

    // Reset form
    tasks.value = [{ title: '', description: '', due_date: '' }]
    validationErrors.value = []
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const serverErrors = err.response.data.errors

      // Set field-level validation errors for red borders + messages
      validationErrors.value = tasks.value.map((t, i) => ({
        title: serverErrors[`tasks.${i}.title`] ? serverErrors[`tasks.${i}.title`][0] : '',
        description: serverErrors[`tasks.${i}.description`] ? serverErrors[`tasks.${i}.description`][0] : '',
        due_date: serverErrors[`tasks.${i}.due_date`] ? serverErrors[`tasks.${i}.due_date`][0] : ''
      }))

      // Only one toastr message for all validation errors
      $toastr.error('Please fill in all required fields.', 'Validation Error')
    } else {
      $toastr.error('Server error, please try again.', 'Error')
    }
  }
}
</script>
