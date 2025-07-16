<script setup>
import { ref } from 'vue'
import { firestore } from '../firebaseResources'
import { collection, collectionGroup, query, where, getDocs} from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, watch, onMounted } from 'vue'

const store = useUserStore()
const route = useRoute()
const viewedUserId = computed(() => route.params.id || null)

const posts = ref([])
watch(viewedUserId, async (newId, oldId) => {
  await getPosts()
})

onMounted(async () => {
  await getPosts()
})

const getPosts = async () => {
  let q

  if (viewedUserId.value) {
    // Filtered user feed
    const userPostsRef = collection(firestore, 'users', viewedUserId.value, 'posts')
    q = query(userPostsRef)
  } else {
    // Global feed
    q = query(collectionGroup(firestore, 'posts'))
  }

  const snapshot = await getDocs(q)
  posts.value = []

  snapshot.forEach(doc => {
    posts.value.push({ id: doc.id, ...doc.data() })
  })


}

</script>
<template>
  <div class="feed-container">
    <h1 class="feed-title">Global Feed</h1>
    <div>{{ viewedUserId }}</div>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="metadata">{{ post.userEmail }} on {{ post.createdAt }}</div>
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
