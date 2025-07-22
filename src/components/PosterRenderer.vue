<script setup>
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import { useRoute } from 'vue-router'

const route = useRoute()

const post = ref({
  text: route.query.text || 'cheeseballs',
  email: route.query.email || 'dogmandoger@gmail.com',
  date: route.query.date || new Date().toLocaleDateString(),
})

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

    <div id="poster" class="poster-area" :class="`theme-${selectedTheme.name}`" :style="{ backgroundImage: `url(${selectedTheme.bg})` }">
      
      <p class="metauser">{{ post.email }}</p>
      <p class="metadate">{{ post.date }}</p>
      <h1 class="content">
        {{ post.text }}
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
  font-size: 50px;
  text-align: left;
  margin-top: 140px;
  align-self: center;
  max-width: 340px;
}

.content{
    text-align: left;
}
</style>