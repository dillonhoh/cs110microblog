<script setup>
import UserStats from '@/components/UserStats.vue'

import Feed from '@/components/Feed.vue'
import FollowSuggestion from '@/components/FollowSuggestion.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import CreatePost from '@/components/CreatePost.vue'
</script>

<template>
  <main>
    <div class="left">
      <UserStats />
      <FollowSuggestion class="followsugg"/>
    </div>
    <CreatePost class="createpost"/>
    <div class="right">
      <Feed />
      
    </div>

    
  </main>
</template>

<style>

.followsugg {
  margin-top: 50px;
}
.createpost {
  height: 100%;
}
main {
  display: flex;
  justify-content: space-evenly;
  align-items: start;
  margin-top: 40px;
}
</style>
