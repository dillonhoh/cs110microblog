<script setup>
import UserStats from '@/components/UserStats.vue'
import Feed from '@/components/Feed.vue'
import FollowSuggestion from '@/components/FollowSuggestion.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import CreatePost from '@/components/CreatePost.vue'
import DownloadPdf from '@/components/DownloadPdf.vue'
import { useUserStore } from '@/stores/user'

const store = useUserStore()

</script>

<template>
  <main>
    <div class="left">
      <UserStats />
      <FollowSuggestion class="followsugg" />
      <DownloadPdf v-if="store.isViewingAnotherUser"/>
    </div>

    <div class="right">
      <Feed />
    </div>
    <CreatePost class="createpost" />
  </main>
</template>

<style>
.followsugg {
  margin-top: 25px;
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
}
</style>
