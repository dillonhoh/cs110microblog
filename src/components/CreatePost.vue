<script setup>
import { ref } from 'vue'
const content=ref('')
const handleSubmit = () => {
    if (!content.value.trim()) {
    alert(`Post must not be empty!`)
    return

  }
    content.value = ''
//   postStore.addPost(userStore.currentUser, content.value)
  
}
</script>
<template>
    <div class="create-container">
        <h1 class="create-title"> Create a Post
    </h1>
    <form class="post-form">
        
        <input type="text" v-model="content" placeholder="Type a Message" />
        <button type="button" @click="handleSubmit">Post</button>
        
    </form>
    
    </div>
    
</template>

<style>
.create-container {
    background-color: lightblue;
    margin-top: 100px;
    padding: 15px 0px 20px 20px;
}
.create-title{
    font-size: 25px;
    font-weight: 500;
}
.post-form {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100px;
}
</style>