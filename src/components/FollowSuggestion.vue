<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseResources'
import { useUserStore } from '../stores/user'

const suggestedEmails = ref([])
const store = useUserStore()

onMounted(async () => {
    suggestedEmails.value = await getSuggestedEmails(store.currentUserId)
})
const getSuggestedEmails = async (currentUid) => {
  const usersCol = collection(firestore, 'users')
  const snapshot = await getDocs(usersCol)

  const suggestions = []


  snapshot.forEach(doc => {
    const data = doc.data()
    if (!currentUid || doc.id !== currentUid) { // to exclude the current user from the list
      suggestions.push({
        uid: doc.id,
        email: data.email,
      })
    }
  })

  return suggestions
}

</script>

<template>
  <div class="suggestion-container">
    <h1 class="suggestion-title">Suggested Following</h1>
    <section v-if="suggestedEmails.length > 0">
      <ul>
        <li v-for="user in suggestedEmails" :key="user.uid">
          <router-link :to="`/users/${user.uid}`" 
          @click="store.viewingUser = user.email; 
          store.viewingUserId = user.uid">{{ user.email }}</router-link>
          <button @click="followUser(user.uid)">Follow</button>
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
  height: fit-content;
}
</style>
