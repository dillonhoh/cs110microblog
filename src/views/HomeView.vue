<script setup>
import UserStats from '@/components/UserStats.vue'
import TheWelcome from '../components/TheWelcome.vue'
import Feed from '@/components/Feed.vue'
import FollowSuggestion from '@/components/FollowSuggestion.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import CreatePost from '@/components/CreatePost.vue'

const route = useRoute()
const userID = ref(route.params.id || '')
watch(
  () => route.params.id,
  (newID) => {
    userID.value = newID
  },
)
</script>

<template>
  <main>
    <UserStats />
    <div class="middle">
      <Feed :userID="userID" />
      <CreatePost />
    </div>

    <FollowSuggestion />
  </main>
</template>

<style>
main {
  display: flex;
  justify-content: space-evenly;
  margin-top: 40px;
}
.middle {
  display: flex;
  flex-direction: column;
}
</style>
