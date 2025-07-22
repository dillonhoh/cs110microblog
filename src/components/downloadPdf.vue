<script setup>
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const store = useUserStore()
const route = useRoute

</script>
<template>
    <button @click="">Download</button>
</template>