<script setup>
    import { ref } from 'vue';

    const taskText = ref('');
    const emit = defineEmits(['add-task']);
    function submitTask() {
        if (taskText.value.trim()) {
            emit('add-task', taskText.value.trim());
            taskText.value = '';
        }
    }
</script>

<template>
    <form @submit.prevent="submitTask">
        <input v-model="taskText" placeholder="New task" />
        <button type="submit">Add</button>
    </form>
</template>

<style scoped>
    form {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
    }
    input {
        flex: 1;
        padding: 8px;
    }
    button{
        padding: 8px;
    }
</style>