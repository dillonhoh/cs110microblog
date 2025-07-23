<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

const store = useUserStore()
</script>

<template>
  <header>
    <nav>
      <RouterLink
        to="/"
        @click="
          store.viewingUserId = '';
          store.viewingUser = ''
        "
        >HOME</RouterLink
      >
      <RouterLink to="/login" class="middle-link">{{ store.isLoggedIn ? 'LOG OUT' : 'LOG IN'}}</RouterLink>
      <router-link
        class="right-link"
        @click="
          store.viewingUser = store.currentUser;
          store.viewingUserId = store.currentUserId
        "
        v-if="store.currentUserId"
        :to="{ name: 'userFeed', params: { id: store.currentUserId } }"
        >MY POSTS</router-link
      >
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 18px;
  margin-top: 18px;
  margin-left: 13px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}
.right-link {
  border-left: 1px solid var(--color-border);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}
nav .middle-link {
  border-left: 1px solid var(--color-primary-soft);
}
nav .right-link {
  border-left: 1px solid var(--color-primary-soft);
}
</style>
