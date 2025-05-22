<template>
  <div>
    <h1>To-do App ✍️🔥</h1>
    <TaskForm @add-task="addTask" />
    <TaskList :tasks="tasks" @delete-task="deleteTask" @update-status="updateTaskStatus" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import TaskForm from './components/TaskForm.vue'
  import TaskList from './components/TaskList.vue'
  const tasks = ref([]);

  onMounted(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`)
      if (!res.ok) throw new Error('Failed to fetch tasks');
      tasks.value = await res.json()
    } catch (error) {
      console.error('Error fetching tasks:', error);
      tasks.value = []
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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ done })
      });
      if (!res.ok) throw new Error('Failed to update task');
      
      const taskIndex = tasks.value.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks.value[taskIndex].done = done;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }
</script>

<style scoped>
</style>
