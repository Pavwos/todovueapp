<template>
  <div class="filter-container">
    <button 
      @click="$emit('change-filter', 'all')" 
      :class="{ active: currentFilter === 'all' }"
    >
      All
    </button>
    <button 
      @click="$emit('change-filter', 'active')" 
      :class="{ active: currentFilter === 'active' }"
    >
      Active
    </button>
    <button 
      @click="$emit('change-filter', 'completed')" 
      :class="{ active: currentFilter === 'completed' }"
    >
      Completed
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentFilter: {
    type: String,
    required: true
  }
});

defineEmits(['change-filter']);
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: rgb(130, 130, 130);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

button:hover {
  background-color: #525252;
}

button.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}
</style>