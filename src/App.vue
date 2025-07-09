<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>

    
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login" class="right-link">Log In</RouterLink>
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


nav a {
  display: inline-block;
  padding: 0 1rem;
}
nav .right-link {
  border-left: 1px solid var(--color-border);

}


</style>
