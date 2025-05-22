<template>
    <div>
        <p v-if="tasks.length === 0">No tasks yet. Add a task to get started!</p>
        <ul v-else>
            <TaskItem 
                v-for="task in tasks" 
                :key="task.id" 
                :task="task" 
                @remove="handleRemove"
                @update-status="handleUpdateStatus"
                @edit="handleEdit" 
            />
        </ul>
    </div>
</template>

<script setup>
    import TaskItem from './TaskItem.vue'
    defineProps({
        tasks: {
            type: Array,
            required: true,
            default: () => []
        }
    })
    const emit = defineEmits(['delete-task', 'update-status', 'edit-task'])
    function handleRemove(taskId) {
        emit('delete-task', taskId)
    }
    function handleUpdateStatus(taskId, done) {
        emit('update-status', taskId, done)
    }
    function handleEdit(taskId, newText) {
        emit('edit-task', taskId, newText)
    }
</script>
<style scoped>
    ul {
        list-style: none;
        padding: 0;
    }
</style>