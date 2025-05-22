<template>
    <li>
        <div class="task-left">
            <input type="checkbox" v-model="localDone" @change="updateTaskStatus" />
            <div v-if="isEditing" class="edit-container">
                <input 
                    v-model="editText" 
                    @keyup.enter="saveEdit" 
                    @keyup.esc="cancelEdit"
                    ref="editInput"
                />
                <div class="edit-buttons">
                    <button @click="saveEdit" class="save-btn">Save</button>
                    <button @click="cancelEdit" class="cancel-btn">Cancel</button>
                </div>
            </div>
            <span v-else :class="{ done: task.done }" @dblclick="startEdit">{{ task.text }}</span>
        </div>
        <div class="task-actions">
            <button @click="startEdit" v-if="!isEditing" class="edit-btn">Edit</button>
            <button @click="emit('remove', task.id)" class="delete-btn">Delete</button>
        </div>
    </li>
</template>

<script setup>
    import { ref, watch, nextTick } from 'vue';
    
    const props = defineProps({
        task: {
            type: Object,
            required: true
        }
    });
    
    const emit = defineEmits(['remove', 'update-status', 'edit']);
    const localDone = ref(props.task.done);
    const isEditing = ref(false);
    const editText = ref('');
    const editInput = ref(null);
    
    watch(() => props.task.done, (newValue) => {
        localDone.value = newValue;
    });
    
    function updateTaskStatus() {
        emit('update-status', props.task.id, localDone.value);
    }
    
    function startEdit() {
        if (!localDone.value) {
            editText.value = props.task.text;
            isEditing.value = true;
            nextTick(() => {
                editInput.value.focus();
            });
        }
    }
    
    function saveEdit() {
        if (editText.value.trim() && editText.value !== props.task.text) {
            emit('edit', props.task.id, editText.value.trim());
        }
        isEditing.value = false;
    }
    
    function cancelEdit() {
        isEditing.value = false;
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
    .task-left {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .task-actions {
        display: flex;
        gap: 5px;
    }
    .done {
        text-decoration: line-through;
        color: gray;
    }
    span {
        margin-left: 8px;
        word-break: break-word;
        cursor: pointer;
    }
    .edit-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 8px;
    }
    .edit-container input {
        padding: 4px;
        margin-bottom: 4px;
    }
    .edit-buttons {
        display: flex;
        gap: 5px;
    }
    button {
        padding: 4px 8px;
        cursor: pointer;
        border: none;
        border-radius: 3px;
    }
    .edit-btn {
        background-color: #4caf50;
        color: white;
    }
    .delete-btn {
        background-color: #f44336;
        color: white;
    }
    .save-btn {
        background-color: #2196F3;
        color: white;
    }
    .cancel-btn {
        background-color: #9e9e9e;
        color: white;
    }
</style>