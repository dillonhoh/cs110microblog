<script setup>
import UserStats from '@/components/UserStats.vue';
import TheWelcome from '../components/TheWelcome.vue'
import Feed from '@/components/Feed.vue';
import FollowSuggestion from '@/components/FollowSuggestion.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute()
const userEmail = ref(decodeURIComponent(route.params.email || ''))
watch(
  () => route.params.email,
  (newEmail) => {
    userEmail.value = decodeURIComponent(newEmail)
  } 
)

</script>

<template>
  <main>
    <UserStats />
    <Feed :userEmail = "userEmail"/>
    <FollowSuggestion />
  </main>
</template>

<style>
main {
  display: flex;
  justify-content: space-evenly;
}
</style>
