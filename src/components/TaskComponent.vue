<template>

    <h2 class="text-3xl font-bold text-center mb-6">Task Manager</h2>
  <div class="min-h-screen bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left Side: Task Form -->
    <div class="bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Add Tasks</h1>

      <form @submit.prevent="submitTasks" class="space-y-6">
        <div v-for="(task, index) in tasks" :key="index" class="pb-4 mb-4 ">
          <h2 class="font-semibold mb-2">Task {{ index + 1 }}</h2>

          <!-- Title -->
          <div>
            <input
              type="text"
              v-model="task.title"
              placeholder="Task Title"
              :class="[
                'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 mb-2',
                validationErrors[index]?.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              ]"
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
              :class="[
                'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 mb-2',
                validationErrors[index]?.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              ]"
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
              :class="[
                'w-full border px-3 py-2 rounded focus:outline-none focus:ring-2',
                validationErrors[index]?.due_date ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              ]"
            />
            <p v-if="validationErrors[index]?.due_date" class="text-red-600 text-sm mt-1">
              {{ validationErrors[index].due_date }}
            </p>
          </div>

          <!-- Remove button -->
          <button
            type="button"
            @click="removeTask(index)"
            class="text-red-500 hover:text-red-700 mt-2"
            v-if="tasks.length > 1"
          >
            Remove
          </button>
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

    <!-- Right Side: Task List -->
    <div class="bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Task List</h1>
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-3 py-2">#</th>
            <th class="border px-3 py-2">Title</th>
            <th class="border px-3 py-2">Description</th>
            <th class="border px-3 py-2">Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, i) in taskList" :key="task.id">
            <td class="border px-3 py-2">{{ i + 1 }}</td>
            <td class="border px-3 py-2">{{ task.title }}</td>
            <td class="border px-3 py-2">{{ task.description }}</td>
            <td class="border px-3 py-2">{{ task.due_date }}</td>
          </tr>
          <tr v-if="taskList.length === 0">
            <td colspan="4" class="text-center py-4 text-gray-500">No tasks yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import axios from 'axios'

// Global toastr
const { appContext } = getCurrentInstance()
const $toastr = appContext.config.globalProperties.$toastr

// Form tasks
const tasks = ref([{ title: '', description: '', due_date: '' }])
const validationErrors = ref([])
const taskList = ref([])  

// Add task
const addTask = () => {
  tasks.value.push({ title: '', description: '', due_date: '' })
  validationErrors.value.push({})
}

// Remove task
const removeTask = (i) => {
  tasks.value.splice(i, 1)
  validationErrors.value.splice(i, 1)
}

// Fetch task list from backend
const getTasks = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/tasks')
    taskList.value = res.data.tasks
  } catch (e) {
    console.error(e)
  }
}

// Submit tasks
const submitTasks = async () => {
  validationErrors.value = []

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/tasks', { tasks: tasks.value })
    $toastr.success(res.data.message, 'Success')

    tasks.value = [{ title: '', description: '', due_date: '' }]
    validationErrors.value = []

    await getTasks()
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const serverErrors = err.response.data.errors
      validationErrors.value = tasks.value.map((t, i) => ({
        title: serverErrors[`tasks.${i}.title`] ? serverErrors[`tasks.${i}.title`][0] : '',
        description: serverErrors[`tasks.${i}.description`] ? serverErrors[`tasks.${i}.description`][0] : '',
        due_date: serverErrors[`tasks.${i}.due_date`] ? serverErrors[`tasks.${i}.due_date`][0] : ''
      }))
      $toastr.error('Please fill in all required fields.', 'Validation Error')
    } else {
      $toastr.error('Server error, please try again.', 'Error')
    }
  }
}

// Load tasks on mount
onMounted(() => {
  getTasks()
})
</script>
