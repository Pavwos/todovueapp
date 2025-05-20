<template>
    <li>
        <input type="checkbox" v-model="localDone" @change="updateTaskStatus" />
        <span :class="{ done: task.done }">{{ task.text }}</span>
        <button @click="emit('remove', task.id)">Delete</button>
    </li>
</template>

<script setup>
    import { ref, watch } from 'vue';
    
    const props = defineProps({
        task: {
            type: Object,
            required: true
        }
    });
    
    const emit = defineEmits(['remove', 'update-status']);
    const localDone = ref(props.task.done);
    
    watch(() => props.task.done, (newValue) => {
        localDone.value = newValue;
    });
    
    function updateTaskStatus() {
        emit('update-status', props.task.id, localDone.value);
    }
</script>

<style scoped>
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid #ccc;
    }
    .done {
        text-decoration: line-through;
        color: gray;
    }
</style>