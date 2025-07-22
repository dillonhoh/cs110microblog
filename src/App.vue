<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

  const store = useUserStore()
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/" @click="store.viewingUserId = ''; store.viewingUser ='' ">Home</RouterLink>
      <RouterLink to="/login" class="right-link">Log In</RouterLink>
      <router-link class="my-posts" 
          @click="store.viewingUser = store.currentUser; 
          store.viewingUserId = store.currentUserId"
      v-if="store.currentUserId" :to="{ name: 'userFeed', params: { id: store.currentUserId } }">My Posts</router-link>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 18px;
  margin-top: 10px;
  margin-left: 10px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}
.my-posts{
  border-left: 1px solid var(--color-border);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}
nav .right-link {
  border-left: 1px solid var(--color-border);
}
</style>
