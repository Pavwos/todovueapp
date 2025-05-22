<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        loading: {
            type: Boolean,
            default: false
        }
    });

    const taskText = ref('');
    const emit = defineEmits(['add-task']);
    
    function submitTask() {
        if (taskText.value.trim() && !props.loading) {
            emit('add-task', taskText.value.trim());
            taskText.value = '';
        }
    }
</script>

<template>
    <form @submit.prevent="submitTask">
        <input v-model="taskText" placeholder="New task" :disabled="loading" />
        <button type="submit" :disabled="loading || !taskText.trim()">
            {{ loading ? 'Adding...' : 'Add' }}
        </button>
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