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
    
    <div class="right">
      <Feed />
      <CreatePost class="createpost"/>
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
.right {
  display: flex;
}
</style>
