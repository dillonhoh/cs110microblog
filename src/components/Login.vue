<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseResources'

const store = useUserStore()

const emailForm = ref('')
const password = ref('')

const errorMessage = ref('')

const clearForm = () => {
  emailForm.value = ''
  password.value = ''
}
const handleSubmit = () => {
  if (store.isLogin) {
    signInWithEmailAndPassword(auth, emailForm.value, password.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user
        store.login(emailForm.value)
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage.value = 'No account with this email exists.'
            break
          case 'auth/wrong-password':
            errorMessage.value = 'Incorrect password.'
            break
          case 'auth/invalid-email':
            errorMessage.value = 'Email format is invalid.'
            break
          case 'auth/invalid-credential':
            errorMessage.value = 'Invalid login credentials.'
            break
          default:
            errorMessage.value = 'Unhandled Firebase auth error:'
        }
        clearForm()
      })
  } else {
    createUserWithEmailAndPassword(auth, emailForm.value, password.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        store.login(emailForm.value)
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage.value = 'Email format is invalid.'
            break
          case 'auth/email-already-in-use':
            errorMessage.value = 'Email is already registered.'
            break
            case 'auth/weak-password':
            errorMessage.value = 'Password is too weak.'
            break
          default:
            errorMessage.value = 'Unhandled Firebase auth error:'
        }
        clearForm()
      })
  }
  clearForm()
}
</script>

<template>
  <div class="form-container">
    <form>
      <div class="option">
        <a :class="{ active: store.isLogin }" @click.prevent="store.toggleMode('login')">Log In</a>
        <a :class="{ active: !store.isLogin }" @click.prevent="store.toggleMode('signup')"
          >Sign Up</a
        >
      </div>

      <template v-if="!store.isLoggedIn">
        <input type="text" v-model="emailForm" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button type="button" @click="handleSubmit">
          {{ store.isLogin ? 'Log In' : 'Sign Up' }}
        </button>
      </template>
      <template v-else>
        <h1>{{ store.currentUser }}</h1>
        <button type="button" @click="store.logout">Log Out</button>
      </template>
      <template v-if="errorMessage">
        <p class="error">{{ errorMessage }}</p>
      </template>
    </form>
  </div>
</template>
<style>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: lightblue;
  width: fit-content;
  margin: auto;
  padding: 0px 15px 0px 15px;
}
.option {
  width: 175px;
  font-size: 16px;
  color: black;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
  margin-top: 10px;
}
a.active {
  text-decoration: underline;
}
form {
  display: flex;
  flex-direction: column;
  width: 175px;
}
form input {
  margin-bottom: 15px;
}
form button {
  margin-bottom: 15px;
}
h1 {
  font-size: 14px;
}
</style>
