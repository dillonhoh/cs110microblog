<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

import { firestore } from '../firebaseResources'
import { useUserStore } from '../stores/user'
import { watch } from 'vue'
const store = useUserStore()

const content = ref('')

const createPost = async (contentText) => {
  const postsCollection = collection(firestore, 'users', store.currentUserId, 'posts')

  await addDoc(postsCollection, {
    content: contentText,
    userId: store.currentUserId,
    userEmail: store.currentUser,
    createdAt: serverTimestamp(),
  })
}

const handleSubmit = async () => {
  if (!content.value.trim()) {
    alert(`Post must not be empty!`)
    return
  }
  await createPost(content.value)
  store.triggerPostUpdate()
  content.value = ''
}
</script>
<template>
  <div v-if="store.isLoggedIn == true" class="create-container">
    <h1 class="create-title">CREATE POST</h1>
    <form class="post-form">
      <textarea v-model="content" placeholder="Type a Message" class="input-content"></textarea>
      <button type="button" @click="handleSubmit" class="input-button">Post</button>
    </form>
  </div>
</template>

<style>
.create-container {
  border: 1px solid var(--color-primary);
  padding: 20px 40px 20px 40px;
  display: flex;
  flex-direction: column;
}
.create-title {
  font-size: 35px;
  font-weight: 700;
  margin-bottom: 10px;
}
.post-form {
  display: flex;
}
.input-content {
  height: 60px;
  resize: none;
  border: 1px solid var(--color-primary);
  color: var(--color-secondary);
  width: 200px;
}
.input-content::placeholder {
  color: var(--color-primary);
}
.input-button {
  width: 50px;
  margin-top: 10px;
}
</style>
