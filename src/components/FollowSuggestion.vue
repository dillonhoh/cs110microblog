<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, query } from 'firebase/firestore'
import { firestore } from '../firebaseResources'
import { useUserStore } from '../stores/user'
import { watch } from 'vue'
import { getFollowerCount, getFollowingCount, getPostCount, populateFollowing } from '../utils/helpers'
import { limit } from 'firebase/firestore'
const suggestedEmails = ref([])

const store = useUserStore()


onMounted(async () => {
    await populateFollowing(store.currentUserId)
    suggestedEmails.value = await getSuggestedEmails(store.currentUserId)
})
watch(
  () => store.statsRefreshTrigger,
  async () => {
    store.followerCount = await getFollowerCount(store.currentUserId)
    store.followingCount = await getFollowingCount(store.currentUserId)
    store.postsCount = await getPostCount(store.currentUserId)
  }
)
watch(
  () => store.viewingUserId,
  async (newVal, oldVal) => {
    
      suggestedEmails.value = await getSuggestedEmails(store.currentUserId)
  },
  { immediate: true }
)

const getSuggestedEmails = async (currentUid) => {
  const usersCol = collection(firestore, 'users')
  const q = query(usersCol, limit(15))
  const snapshot = await getDocs(q)

  const following = store.following || []

  const suggestions = []
if (store.viewingUserId && store.viewingUserId !== currentUid) {
  console.log("now viewing other user")
    const userDoc = await getDoc(doc(firestore, 'users', store.viewingUserId))
    if (userDoc.exists()) {
      const data = userDoc.data()
      suggestions.push({
        uid: store.viewingUserId,
        email: data.email,
      })
      return suggestions
    }
  }
else{
  snapshot.forEach(doc => {
    const data = doc.data()
    const userId = doc.id

    if (
      userId !== currentUid &&          // exclude self
      !following.includes(userId)       // exclude already following
    )  {
      suggestions.push({
        uid: doc.id,
        email: data.email,
      })
    }
  })

  return suggestions.slice(0, 5)
}
}
const followUser = async (otherUserId) => {
  const currentUid = store.currentUserId
  if (!currentUid || !otherUserId || currentUid === otherUserId) return

  try {
    // Add to current user's "following"
    const currentUserRef = doc(firestore, 'users', currentUid)
    await updateDoc(currentUserRef, {
      following: arrayUnion(otherUserId)
    })

    // Add to target user's "followers"
    const targetUserRef = doc(firestore, 'users', otherUserId)
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUid)
    })

    // Optional: trigger re-render or stat update
    
    await populateFollowing(currentUid)
    suggestedEmails.value = await getSuggestedEmails(currentUid)
    store.triggerStatsRefresh()
    store.triggerPostUpdate()


  } catch (error) {
    console.error('Error following user:', error)
  }
}
</script>

<template>
  <div class="suggestion-container">
    <h1 class="suggestion-title">Suggested Following</h1>
    <section v-if="suggestedEmails.length > 0" class="email-container">
      <ul>
        <li v-for="user in suggestedEmails" :key="user.uid">
          <router-link :to="`/users/${user.uid}`" 
          @click="store.viewingUser = user.email; 
          store.viewingUserId = user.uid">{{ user.email }}</router-link>
          <button @click="followUser(user.uid)" v-if="store.isLoggedIn">Follow</button>
        </li>
        
      </ul>
    </section>
    <p v-else>Nobody to Follow, Check Back Later</p>
  </div>
</template>
<style>
ul {
  list-style-type: none;
}
.suggestion-title {
  font-weight: 600;
  font-size: 25px;
}
.suggestion-container {
  width: 300px;
  background-color: lightblue;
  padding: 15px 0px 15px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.email-container ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}
</style>
