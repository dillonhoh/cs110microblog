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
  <div  v-if="store.isLoggedIn == true" class="create-container">
    <h1 class="create-title">Create a Post</h1>
    <form class="post-form">
      <textarea v-model="content" placeholder="Type a Message" class="input-content"></textarea>
      <button type="button" @click="handleSubmit" class="input-button">Post</button>
    </form>
  </div>
</template>


<style>
.create-container {
  background-color: lightblue;
  padding: 10px 20px 20px 20px;
  display: flex;
  flex-direction: column;
}
.create-title {
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 15px;
}
.post-form {
  display: flex;
}
.input-content{
  height: 50px;
  resize: none;
}
.input-button{
  width: 50px;
  margin-top: 10px;
}

</style>
