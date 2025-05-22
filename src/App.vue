<template>
  <div class="app-container">
    <h1>To-do App ✍️🔥</h1>
    <TaskForm @add-task="addTask" :loading="isLoading" />
    <LoadingSpinner v-if="isLoading" />
    <TaskList v-else :tasks="tasks" @delete-task="deleteTask" @update-status="updateTaskStatus" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import TaskForm from './components/TaskForm.vue'
  import TaskList from './components/TaskList.vue'
  import LoadingSpinner from './components/LoadingSpinner.vue'
  
  const tasks = ref([]);
  const isLoading = ref(true);

  onMounted(async () => {
    isLoading.value = true;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`)
      if (!res.ok) throw new Error('Failed to fetch tasks');
      tasks.value = await res.json()
    } catch (error) {
      console.error('Error fetching tasks:', error);
      tasks.value = []
    } finally {
      isLoading.value = false;
    }
  })

  async function addTask(taskText) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: taskText })
      });
      if (!res.ok) throw new Error('Failed to add task');
      const nova = await res.json()
      tasks.value.push(nova)
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  async function deleteTask(taskId) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error('Failed to delete task');
      tasks.value = tasks.value.filter(task => task.id !== taskId)
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  async function updateTaskStatus(taskId, done) {
    // Optimistic update
    const taskIndex = tasks.value.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].done = done;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ done })
      });
      if (!res.ok) throw new Error('Failed to update task');
      
      // Update with server response if needed
      const updatedTask = await res.json();
      if (taskIndex !== -1) {
        tasks.value[taskIndex].done = updatedTask.done;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert optimistic update on error
      if (taskIndex !== -1) {
        tasks.value[taskIndex].done = !done;
      }
    }
  }
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>
