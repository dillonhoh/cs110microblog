<script setup>
import { useUserStore } from '../stores/user'
import { onMounted } from 'vue'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseResources'
import { computed } from 'vue'
import { watch } from 'vue'

const store = useUserStore()
const displayId = computed(() => store.viewingUserId || store.currentUserId)

watch(displayId, async (newId, oldId) => {
  store.followerCount = await getFollowerCount(newId)
  store.followingCount = await getFollowingCount(newId)
  store.postsCount = await getPostCount(newId)
})


const getFollowerCount = async (id) => {
  try {
    const userRef = doc(firestore, 'users', id)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const followers = data.followers || []
      return followers.length
    }
  } catch (error) {
    console.error('Failed to get follower count:', error)
    return 0
  }
}
const getFollowingCount = async (id) => {
  try {
    const userRef = doc(firestore, 'users', id)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const following = data.following || []
      return following.length
    }
  } catch (error) {
    console.error('Failed to get following count:', error)
    return 0
  }
}
const getPostCount = async (id) => {
  try {
    const postRef = collection(firestore, 'users', id, 'posts')
    const snapshot = await getDocs(postRef)

    return snapshot.size
  } catch (error) {
    console.error('Failed to get posts count:', error)
    return 0
  }
}


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
