<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

import { auth } from '../firebaseResources'
import { firestore } from '../firebaseResources'

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
  await setDoc(userRef, { // actually modifying/creating the database
    email: user.email,
    followers: [],
    following: [],
  })
}
const getFollowerCount = async (uid) => {
  try {
    const userRef = doc(firestore, 'users', uid)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const followers = data.followers || []
      return followers.length
    }
  } catch (error) {
    console.error("Failed to get follower count:", error)
    return 0
  }
}
const getFollowingCount = async (uid) => {
  try {
    const userRef = doc(firestore, 'users', uid)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const following = data.following || []
      return following.length
    }
  } catch (error) {
    console.error("Failed to get following count:", error)
    return 0
  }
}
const getSuggestedEmails = async (currentUid) => {
  const usersCol = collection(firestore, 'users')
  const snapshot = await getDocs(usersCol)

  const suggestions = []

  snapshot.forEach(doc => {
    const data = doc.data()
    if (doc.id !== currentUid) { // to exclude the current user from the list
      suggestions.push({
        uid: doc.id,
        email: data.email,
      })
    }
  })
  return suggestions
}
const handleSubmit = () => {
  if (store.isLogin) {
    signInWithEmailAndPassword(auth, emailForm.value, password.value)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user
        store.login(user.email, user.uid) 

        const followerC = await getFollowerCount(user.uid)
        store.followerCount = followerC
        const followingC = await getFollowingCount(user.uid)
        store.followingCount = followingC

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

        const followerC = await getFollowerCount(user.uid)
        store.followerCount = followerC
        const followingC = await getFollowingCount(user.uid)
        store.followingCount = followingC
     
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
          <a :class="{ active: store.isLogin }" @click.prevent="store.toggleMode('login')">Log In</a>
          <a :class="{ active: !store.isLogin }" @click.prevent="store.toggleMode('signup')"
            >Sign Up</a
          >
        </div>
      </template>
      <template v-if="!store.isLoggedIn">
        <input type="text" v-model="emailForm" placeholder="Email" />
        <input type="password" v-model="password" placeholder="Password" />
        <button type="button" @click="handleSubmit">
          {{ store.isLogin ? 'Log In' : 'Sign Up' }}
        </button>
      </template>
      <template v-else>
        <h1 class="user-email">{{ store.currentUser }}</h1>
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
.error {
  font-weight: 400;
  color: lightcoral;
  margin-bottom: 15px;
}
.user-email{
  text-align: center;
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 18px;
}
</style>
