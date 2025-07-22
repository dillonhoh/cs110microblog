<script setup>
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import { useRoute } from 'vue-router'

const route = useRoute()

const post = ref({
  text: route.query.text || 'Example post text',
  email: route.query.email || 'user@example.com',
  date: route.query.date || new Date().toLocaleDateString(),
})

const themes = [
  {
    name: 'classic',
    label: 'Classic',
    bg: '/classic.svg',
    font: 'Georgia, serif',
    size: '32px'
  },
  {
    name: 'sunset',
    label: 'Sunset',
    bg: '/sunset.svg',
    font: 'Arial, sans-serif',
    size: '28px'
  },
  {
    name: 'celebration',
    label: 'Celebration',
    bg: '/celebration.svg',
    font: '"Comic Sans MS", cursive',
    size: '30px'
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
  <div class="poster-editor">
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

    <div id="poster" class="poster-area" :style="{ backgroundImage: `url(${selectedTheme.bg})` }">
      
      <p class="metauser">{{ post.email }}</p>
      <p class="metadate">{{ post.date }}</p>
      <h1 :style="{ fontFamily: selectedTheme.font, fontSize: selectedTheme.size } " class="content">
        {{ post.text }}
      </h1>
    </div>

    <button @click="downloadPoster">Download Poster</button>
  </div>
</template>

<style scoped>
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
.metauser {
  margin-top: 20px;
  font-size: 36px;
  font-weight: 700;
}
.metadate {
  margin-top: 20px;
  font-size: 16px;
}
.filler {
    font-size: 36px;
  font-weight: 700;
}
.content{
    align-self: center;
    margin-top: 350px;
    font-weight: 600;
}
.theme-options {
  margin-bottom: 20px;
}
button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>