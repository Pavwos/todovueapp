<template>
  <div class="app-container">
    <h1>To-do App ✍️🔥</h1>
    <TaskForm @add-task="addTask" :loading="isLoading" />
    <TaskFilter :current-filter="filter" @change-filter="changeFilter" />
    <LoadingSpinner v-if="isLoading" />
    <TaskList v-else :tasks="filteredTasks" @delete-task="deleteTask" @update-status="updateTaskStatus" @edit-task="editTask" />
    <div class="task-stats" v-if="!isLoading && tasks.length > 0">
      <p>{{ activeTasksCount }} active / {{ completedTasksCount }} completed</p>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import TaskFilter from './components/TaskFilter.vue';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
  
  const tasks = ref([]);
  const isLoading = ref(true);
  const filter = ref('all');
  
  const filteredTasks = computed(() => {
    if (filter.value === 'active') {
      return tasks.value.filter(task => !task.done);
    } else if (filter.value === 'completed') {
      return tasks.value.filter(task => task.done);
    }
    return tasks.value;
  });
  
  const activeTasksCount = computed(() => {
    return tasks.value.filter(task => !task.done).length;
  });
  
  const completedTasksCount = computed(() => {
    return tasks.value.filter(task => task.done).length;
  });
  
  function changeFilter(newFilter) {
    filter.value = newFilter;
  }

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
      
      const updatedTask = await res.json();
      if (taskIndex !== -1) {
        tasks.value[taskIndex].done = updatedTask.done;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      if (taskIndex !== -1) {
        tasks.value[taskIndex].done = !done;
      }
    }
  }
  
  async function editTask(taskId, newText) {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const originalText = tasks.value[taskIndex].text;
      tasks.value[taskIndex].text = newText;
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: newText })
        });
        if (!res.ok) throw new Error('Failed to update task');
        
        const updatedTask = await res.json();
        tasks.value[taskIndex].text = updatedTask.text;
      } catch (error) {
        console.error('Error updating task:', error);
        tasks.value[taskIndex].text = originalText;
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
  color: #737373;
}

.task-stats {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>
