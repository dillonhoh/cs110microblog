<script setup>
const suggestedEmails = [
  {email: 'bubster100@gmail.com',
    id: '1'
  },
  {email: 'superguy@gmail.com',
    id: '2'
  },
  {email: 'pilatesprincess@gmail.com',
    id: '3'
  },
  'hectagon@ucr.edu',
  'spook@yahoo.com'
]
</script>

<template>
    <div class ="suggestion-container">
    <h1 class="suggestion-title">Suggested Following</h1>
    <p v-if="true">
        <ul>
      <li v-for="email in suggestedEmails" :key="email">
        <router-link :to="`/users/${encodeURIComponent(email)}`">@{{ email }}</router-link>
      </li>
    </ul>
    </p>
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
}
</style>