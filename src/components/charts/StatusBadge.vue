<template>
  <span class="badge" :class="status === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'">
    <span aria-hidden="true">{{ status === 'error' ? '✕' : '✓' }}</span>
    {{ status === 'error' ? 'Error' : 'OK' }}
  </span>
</template>

<script setup>
defineProps({
  status: { type: String, required: true }
})
</script>
