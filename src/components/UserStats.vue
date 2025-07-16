<script setup>
import { useUserStore } from '../stores/user'
import { computed } from 'vue'
import { watch } from 'vue'
import { getFollowerCount, getFollowingCount, getPostCount } from '../utils/helpers'

const store = useUserStore()
const displayId = computed(() => store.viewingUserId || store.currentUserId)

watch(displayId, async (newId) => {
  if (!newId) return

  store.followerCount = await getFollowerCount(newId)
  store.followingCount = await getFollowingCount(newId)
  store.postsCount = await getPostCount(newId)
})

watch(
  () => store.postUpdateTrigger,
  async () => {
    store.postsCount = await getPostCount(displayId.value)
  },
)

</script>
<template>
  <div class="user-stats">
    <h1 v-if="store.isViewingAnotherUser" class="user-email-stats">
      {{ store.viewingUser }}
    </h1>
    
    <h1 v-else class="user-email-stats">
      {{ store.currentUser }}
    </h1>
    <template v-if="store.isViewingAnotherUser || store.isLoggedIn">
      <div class="profile-stats">
        <div class="stat">
          <div>Posts</div>
          <div class="stat-number">{{ store.postsCount }}</div>
        </div>
        <div class="stat">
          <div>Following</div>
          <div class="stat-number">{{ store.followingCount }}</div>
        </div>
        <div class="stat">
          <div>Followers</div>
          <div class="stat-number">{{ store.followerCount }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <RouterLink to="/login">Log In</RouterLink>
    </template>
    
  </div>
</template>
<style>
.user-stats {
  background-color: lightblue;
  width: 300px;
  padding: 15px 0px 15px 0px;
  height: 100px;
}
.user-email-stats {
  font-size: 20px;
  margin-left: 22px;
  font-weight: bold;
}
.profile-stats {
  display: flex;
  justify-content: space-around;
}
</style>
