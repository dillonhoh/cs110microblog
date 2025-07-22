<script setup>
import { ref, onMounted, watch } from 'vue'
import html2canvas from 'html2canvas'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../firebaseResources'

const route = useRoute()

const post = ref(null)
const loading = ref(true)

watch(
  () => route.params.id,
  async (postId) => {
    console.log('Route param id:', postId)
    if (postId) {
      try {
        const userId = route.params.userId
        const docRef = doc(firestore, 'users', userId, 'posts', postId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          post.value = docSnap.data()
        } else {
          console.error('No such document!')
        }
      } catch (err) {
        console.error('Error fetching post:', err)
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: true }
)

const themes = [
  {
    name: 'classic',
    label: 'Classic',
    bg: '/classic.svg',
  },
  {
    name: 'sunset',
    label: 'Sunset',
    bg: '/sunset.svg',
  },
  {
    name: 'celebration',
    label: 'Celebration',
    bg: '/celebration.svg'
  },
]

const selectedTheme = ref(themes[0])

function selectTheme(theme) {
  selectedTheme.value = theme
}

async function downloadPoster() {
  const element = document.getElementById('poster')
  const canvas = await html2canvas(element)
  const link = document.createElement('a')
  link.download = 'poster.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div class="poster-editor" v-if="!loading">
    <div class="theme-options">
      <button 
        v-for="theme in themes" 
        :key="theme.name" 
        @click="selectTheme(theme)"
        :class="{ active: selectedTheme.name === theme.name }"
      >
        {{ theme.label }}
      </button>
    </div>

    <div id="poster" class="poster-area" :class="`theme-${selectedTheme.name}`" :style="{ backgroundImage: `url(${selectedTheme.bg})` }">
      
      <p class="metauser">{{ post.userEmail }}</p>
      <p class="metadate">{{ post.createdAt.toDate().toLocaleDateString() }}</p>
      <h1 class="content">
        {{ post.content }}
      </h1>
    </div>

    <button @click="downloadPoster">Download Poster</button>
  </div>
</template>

<style scoped>
/* buttons */
.theme-options {
  margin-bottom: 50px;
}
button.active {
  font-weight: bold;
  text-decoration: underline;
}
/* actual poster */
.poster-area {
  width: 600px;
  height: 800px;
  background-size: cover;
  background-position: center;
  padding: 40px;
  border: 2px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  margin: auto;
  display: flex;
  flex-direction: column;
}
.theme-classic .metauser{
  font-family: 'Instrument Sans';
  text-decoration: underline;
  font-size: 28px;
}
.theme-classic .metadate{
  font-family: 'Instrument Sans';
  font-size: 18px;
}
.theme-classic .content{
  font-family: 'Martian Mono';
  font-weight: 100;
  font-size: 21px;
  margin-top: 150px;
}
.theme-sunset .metauser{
  margin-top: 65px;
  font-family: 'Montserrat';
  align-self: center;
  font-size: 25px;
  font-weight: 700;
  text-align: center;
}
.theme-sunset .metadate{
  margin-top: 17px;
  font-family: 'Montserrat';
  align-self: center;
  font-size: 20px;
  font-weight: 600;
}
.theme-sunset .content{
  font-family: 'Open Sans';
  font-weight: 300;
  font-size: 21px;
  text-align: left;
  margin-top: 50px;
  align-self: center;
  max-width: 340px;
}
.theme-celebration .metauser{
  margin-top: 250px;
  font-family: 'Montserrat';
  align-self: center;
  font-size: 25px;
  font-weight: 700;
  text-align: center;
}
.theme-celebration .metadate{
  margin-top: 17px;
  font-family: 'Montserrat';
  align-self: center;
  font-size: 20px;
  font-weight: 600;
}
.theme-celebration .content{
  font-family: 'Comic Sans MS';
  font-weight: 700;
  font-size: 40px;
  text-align: left;
  margin-top: 140px;
  align-self: center;
  max-width: 340px;
}

.content{
    text-align: left;
}
</style>