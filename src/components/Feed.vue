<script setup>
import { ref } from 'vue'
import { firestore } from '../firebaseResources'
import { collection, collectionGroup, query, getDocs } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, watch, onMounted } from 'vue'
import { limit } from 'firebase/firestore'
import { orderBy } from 'firebase/firestore'
import { doc, deleteDoc } from 'firebase/firestore'
import 'primeicons/primeicons.css'


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
  } else if (store.currentUserId) {
    q = query(collectionGroup(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(10))

    const snapshot = await getDocs(q)
    posts.value = []
    snapshot.forEach((doc) => {
      const post = doc.data()
      if (store.following.includes(post.userId)) {
        posts.value.push({ id: doc.id, ...post })
      }
    })
    return
  } else {
    // Global feed
    q = query(collectionGroup(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(10))
  }

  const snapshot = await getDocs(q)
  posts.value = []

  snapshot.forEach((doc) => {
    posts.value.push({ id: doc.id, ...doc.data() })
  })
}

const deletePost = async (postId) => {
  try {
    const postRef = doc(firestore, 'users', store.currentUserId, 'posts', postId)
    await deleteDoc(postRef)
    await getPosts() // refresh post list after deletion
    store.triggerPostUpdate()
  } catch (error) {
    console.error('Failed to delete post:', error)
  }
}
</script>
<template>
  <div class="feed-container">
    <h1 class="feed-title" v-if="store.viewingUser === store.currentUser && store.isLoggedIn">MY POSTS</h1>
    <h1 class="feed-title" v-else-if="store.isViewingAnotherUser">
      {{ store.viewingUser.split('@')[0].toUpperCase() }}'S POSTS
    </h1>
    <h1 class="feed-title" v-else>GLOBAL FEED</h1>
    <div v-if="posts.length == 0" class="noposts">No posts now.</div>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="top-container">
      <div class="email">{{ post.userEmail }}</div>
        <router-link 
        class="icons"
        @click="store.viewingUser = '';
              store.viewingUserId = ''"
        :to="{ name: 'Poster', params: { userId: post.userId, id: post.id } }">
          <i class="pi pi-arrow-right"></i>
          <i class="pi pi-file"></i>
        </router-link>
      </div>
      <div class="metadata">
        <div>{{ post.createdAt.toDate().toLocaleDateString() }}</div>
        <div class="time">{{ post.createdAt.toDate().toLocaleTimeString() }}</div>
      </div>
      <hr />
      <div class="content">
        {{ post.content }}
      </div>
      <div class="trash">
      <i class="pi pi-trash"
      v-if="store.viewingUser == store.currentUser 
      && store.isLoggedIn"
      @click="deletePost(post.id)"></i>
      </div>
    </div>
  </div>
</template>
<style>
.feed-title {
  font-weight: 700;
  font-size: 35px;
  justify-self: center;
  margin: 0px 0px 15px 0px;
}
.feed-container {
  border: 1px solid var(--color-primary);
  width: 450px;
  padding: 25px 0px 0px 0px;
}
.noposts {
  margin: 0px 0px 15px 30px
}
.post {
  padding-top: 15px;
  padding-bottom: 20px;
  padding-left: 30px;
  border-top: 1px solid var(--color-primary);

}
.email {
  font-weight: 600;
}
.top-container{
  display: flex;
  justify-content: space-between;
  max-width: 450px;
  margin-right: 30px;
}
.metadata {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.time {
  text-align: center;
  margin-right: 30px;
}
hr {
  margin-right: 30px;
  border: none;
  border-top: 1px solid #A9A9A9;
}
.content {
  font-weight: 300;
  font-size: 17px;
  padding-right: 30px;
}
.pi {
  color: var(--color-primary);
}
.pi:hover{
  color: var(--color-primary);
  
}
.icons {
  transition: all 0.3s ease;
}
.icons:hover {
  transform: scale(1.25)
}
.trash {
  display: flex;
  justify-content: end;
  margin-right: 30px;
  
  
}
.pi-trash {
  transition: all 0.3s ease;
  transform-origin: center;
}
.pi-trash:hover {
  cursor: pointer;
  transform: scale(1.25)
}

</style>
