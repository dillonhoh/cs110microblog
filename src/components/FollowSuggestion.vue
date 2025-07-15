<script setup>
const suggestedEmails = [
  { email: 'bubster100@gmail.com', id: '1' },
  { email: 'superguy@gmail.com', id: '2' },
  { email: 'pilatesprincess@gmail.com', id: '3' },
  { email: 'hectagon@ucr.edu', id: '4' },
  { email: 'spook@yahoo.com', id: '5' },
]
</script>

<template>
  <div class="suggestion-container">
    <h1 class="suggestion-title">Suggested Following</h1>
    <section v-if="true">
      <ul>
        <li v-for="email in suggestedEmails" :key="email.id">
          <router-link :to="`/users/${email.id}`">{{ email.email }}</router-link>
        </li>
      </ul>
    </section>
    <p v-else>Nobody to Follow, Check Back Later</p>
  </div>
</template>
<style>
ul {
  list-style-type: none;
}
.suggestion-title {
  font-weight: 600;
  font-size: 25px;
}
.suggestion-container {
  width: 300px;
  background-color: lightblue;
  padding: 15px 0px 15px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
}
</style>
