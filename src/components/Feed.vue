<script setup>
import { ref } from 'vue'
import { firestore } from '../firebaseResources'
import { collection, collectionGroup, query, where, getDocs } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, watch, onMounted } from 'vue'
import { limit } from 'firebase/firestore'
import { orderBy } from 'firebase/firestore'

const store = useUserStore()
const route = useRoute()
const viewedUserId = computed(() => route.params.id || null)

const posts = ref([])
watch(viewedUserId, async (newId, oldId) => {
  await getPosts()
})
watch(
  () => store.postUpdateTrigger,
  async () => {
    await getPosts()
  },
)

onMounted(async () => {
  await getPosts()
})

const getPosts = async () => {
  let q

  if (viewedUserId.value) {
    // clicked user feed
    const userPostsRef = collection(firestore, 'users', viewedUserId.value, 'posts')
    q = query(userPostsRef, orderBy('createdAt', 'desc'), limit(10))
  } 

  else if (store.currentUserId) {
    q = query(collectionGroup(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(10))

    const snapshot = await getDocs(q)
    posts.value=[]
    snapshot.forEach((doc) => {
      const post = doc.data()
      if (store.following.includes(post.userId)) {
        posts.value.push({ id: doc.id, ...post })
      }
    })
    return 
  } 

  else {
    // Global feed
    q = query(collectionGroup(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(10))
  }

  const snapshot = await getDocs(q)
  posts.value = []

  snapshot.forEach((doc) => {
    posts.value.push({ id: doc.id, ...doc.data() })
  })
}
</script>
<template>
  <div class="feed-container">
    <h1 class="feed-title">Global Feed</h1>
    <div v-if="posts.length == 0">
      No posts now. 
    </div>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="email">{{ post.userEmail }}</div>
      <div class="metadata">
        <div>{{ post.createdAt.toDate().toLocaleDateString() }}</div>
        <div class="time">{{ post.createdAt.toDate().toLocaleTimeString() }}</div>
        </div>
        <router-link :to="{ name: 'Poster', params: { userId: post.userId, id: post.id } }">
      <button class="btn">Make Poster</button>
    </router-link>
        <hr>
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
.email {
  font-weight: 300;
}
.metadata {
  display: flex;
  justify-content: space-between;
}
.time {
  margin-right: 30px;
}
hr {
  margin-right: 30px;
}
</style>
