<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, query } from 'firebase/firestore'
import { firestore } from '../firebaseResources'
import { useUserStore } from '../stores/user'
import { watch } from 'vue'
import {
  getFollowerCount,
  getFollowingCount,
  getPostCount,
  populateFollowing,
} from '../utils/helpers'
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
  },
)
watch(
  () => store.viewingUserId,
  async (newVal, oldVal) => {
    suggestedEmails.value = await getSuggestedEmails(store.currentUserId)
  },
  { immediate: true },
)

const getSuggestedEmails = async (currentUid) => {
  const usersCol = collection(firestore, 'users')
  const q = query(usersCol, limit(15))
  const snapshot = await getDocs(q)

  const following = store.following || []

  const suggestions = []
  if (store.viewingUserId && store.viewingUserId !== currentUid) {
    console.log('now viewing other user')
    const userDoc = await getDoc(doc(firestore, 'users', store.viewingUserId))
    if (userDoc.exists()) {
      const data = userDoc.data()
      suggestions.push({
        uid: store.viewingUserId,
        email: data.email,
      })
      return suggestions
    }
  } else {
    snapshot.forEach((doc) => {
      const data = doc.data()
      const userId = doc.id

      if (
        userId !== currentUid && // exclude self
        !following.includes(userId) // exclude already following
      ) {
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
      following: arrayUnion(otherUserId),
    })

    // Add to target user's "followers"
    const targetUserRef = doc(firestore, 'users', otherUserId)
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUid),
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
    <h1 class="suggestion-title">SUGGESTED</h1>
    <section v-if="suggestedEmails.length > 0" class="email-container">
      <ul>
        <li v-for="user in suggestedEmails" :key="user.uid">
          <router-link
            :to="`/users/${user.uid}`"
            @click="
              store.viewingUser = user.email;
              store.viewingUserId = user.uid
            "
            >{{ user.email }}</router-link
          >
          <button class="follow" @click="followUser(user.uid)" v-if="store.isLoggedIn">Follow</button>
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
  font-weight: 700;
  font-size: 35px;
  margin: 0px 0px 20px 0px;
  padding: 0px 0px 12px 0px;
  border-bottom: 1px solid var(--color-primary);
  
}
.suggestion-container {
  border: 1px solid var(--color-primary);
  padding: 15px 0px 10px 0px;
  text-align: center;
  margin: auto;
}
.email-container ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 275px;
  margin-right: 30px;
  margin-bottom: 12px;
}
.email-container ul li a {
  color: #002F63;
}
.email-container ul li a:visited {
  color: #002F63;
}
.email-container ul li a:hover {
  color:rgb(33, 108, 193);
}

.follow {
  font-size: 12px;
  padding: 1px 3px 1px 3px;
}

</style>
