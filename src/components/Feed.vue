<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  userEmail: String
})

const posts = ref([
  {
    author: 'bubster100@gmail.com',
    timestamp: '2025-07-09T11:38:00',
    content: 'hi im bubster'
  },
  {
    author: 'superguy@gmail.com',
    timestamp: '2025-06-09T09:40:23',
    content: 'did u guys watch new movie?'
  },
  {
    author: 'pilatesprincess@gmail.com',
    timestamp: '2025-06-11T04:30:43',
    content: 'Lets do pilates!'
  },
  {
    author: 'hectagon@ucr.edu',
    timestamp: '2025-06-16T05:20:18',
    content: 'im a shape'
  },
  {
    author: 'spook@yahoo.com',
    timestamp: '2025-07-03T08:22:02',
    content: 'spook'
  }
])


const filteredPosts = computed(() => {
  return props.userEmail
    ? posts.value.filter(post => post.author === props.userEmail)
    : posts.value
})

const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString()
}

</script>
<template>
  <div class="feed-container">
    <h1 class="feed-title">Global Feed</h1>
    
    <div
      v-for="(post, index) in filteredPosts"
      :key="index"
      class="post"
    >
      <div class="meta">
        @{{ post.author }} on {{ formatDateTime(post.timestamp) }}
      </div>
      <div class="content">
        {{ post.content }}
      </div>
    </div>
  </div>
</template>
<style>
.feed-title {
    font-weight: 600;
    font-size: 25px; 
    padding-left: 15px; 
    justify-self: center;
}
.feed-container {
    background-color: lightblue;
    width: 450px;
    padding: 25px 0px 0px 0px;
}
.post {
    padding-bottom: 20px;
    padding-left: 30px;
}
</style>