<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore'

import { auth } from '../firebaseResources'
import { firestore } from '../firebaseResources'

import { getFollowerCount, getFollowingCount, getPostCount } from '../utils/helpers'
import { populateFollowing } from '../utils/helpers'

const store = useUserStore()

const emailForm = ref('')
const password = ref('')

const errorMessage = ref('')

const clearForm = () => {
  emailForm.value = ''
  password.value = ''
}

const createUserInFirestore = async (user) => {
  const userRef = doc(firestore, 'users', user.uid) // exists as a pointer/reference to the document
  await setDoc(userRef, {
    // actually modifying/creating the database
    email: user.email,
    followers: [],
    following: [],
  })
}

const handleSubmit = () => {
  if (store.isLogin) {
    signInWithEmailAndPassword(auth, emailForm.value, password.value)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user
        store.login(user.email, user.uid)
        await populateFollowing(user.uid)
        store.followerCount = await getFollowerCount(user.uid)
        store.followingCount = await getFollowingCount(user.uid)
        store.postsCount = await getPostCount(user.uid)
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
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user
        store.login(user.email, user.uid)
        await createUserInFirestore(user)
        await populateFollowing(user.uid)

        store.followerCount = await getFollowerCount(user.uid)
        store.followingCount = await getFollowingCount(user.uid)
        store.postsCount = await getPostCount(user.uid)
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
            errorMessage.value = 'Unhandled Firebase auth error'
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
      <template v-if="!store.isLoggedIn">
        <div class="option">
          <a :class="{ active: store.isLogin }" @click.prevent="store.toggleMode('login')"
            >LOG IN</a
          >
          <a :class="{ active: !store.isLogin }" @click.prevent="store.toggleMode('signup')"
            >SIGN UP</a
          >
        </div>
      </template>
      <template v-if="!store.isLoggedIn">
        <input type="text" v-model="emailForm" placeholder="Email" id="email" class="inputs" />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          id="password"
          class="inputs"
        />
        <button type="button" @click="handleSubmit">
          {{ store.isLogin ? 'Log In' : 'Create' }}
        </button>
      </template>
      <template v-else>
        <h1 class="user-email">{{ store.currentUser }}</h1>
        <button type="button" @click="store.logout" class="logout-button">Log Out</button>
      </template>
      <template v-if="errorMessage && !store.isLoggedIn">
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
  border: 1px solid var(--color-primary);
  width: fit-content;
  margin: auto;
  padding: 0px 15px 15px 15px;
}
.option {
  width: 175px;
  font-size: 16px;
  color: var(--color-primary);
  display: flex;
  justify-content: space-around;
  margin-bottom: 18px;
  margin-top: 10px;
  font-weight: 400;
  letter-spacing: -1px;
}
a.active {
  text-decoration: underline;
}
form {
  display: flex;
  flex-direction: column;
  width: 175px;
}
.inputs {
  margin-bottom: 15px;
  border: 1px solid var(--color-primary);
  color: var(--color-secondary);
  font-family: Azeret Mono;
}
.inputs::placeholder{
  color: var(--color-primary);
  font-family: Azeret Mono;
}
.logout-button {
  margin-bottom: 0px;
}
h1 {
  font-size: 14px;
}
.error {
  font-weight: 700;
  color: var(--color-secondary);
  font-size: 20px;
  margin-bottom: 5px;
  margin-top: 15px;
  text-align: center;
}
.user-email {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 18px;
}

button {
  all: unset;
  text-align: center;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: inherit;
  border-radius: 2px;
}

button:hover {
  background-color: var(--color-secondary);
  color: white;
}

</style>
