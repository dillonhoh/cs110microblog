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
  
    
    <template v-if="store.isViewingAnotherUser || store.isLoggedIn">
      <div class="user-stats">
      <h1 v-if="store.isViewingAnotherUser" class="user-email-stats">
      {{ store.viewingUser }}
    </h1>

    <h1 v-else class="user-email-stats">
      {{ store.currentUser }}
    </h1>
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
      </div>
    </template>
    
  
  <template v-else >
      <RouterLink to="/login" class="default">
        Log In
      </RouterLink>
    </template>
</template>
<style>
.user-stats {
  border: 1px solid var(--color-primary);
  padding: 15px 0px 15px 0px;
}
.user-email-stats {
  font-size: 25px;
  margin: auto;
  font-weight: bold;
  text-align: center;
}
.profile-stats {
  display: flex;
  justify-content: space-around;
}
.default{
  display: block;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  text-decoration: none;
  border: 1px solid var(--color-primary);
  transition: all 0.3s ease;
  background-color: var(--color-primary);
  color: white;
}
.default:visited {
  color: white;
}

.default:hover{
  background-color: var(--color-secondary); 
  color: white;
}
</style>
