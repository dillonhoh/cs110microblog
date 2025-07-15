import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: '',
    viewingUser: '',
    isLoggedIn: false,
    mode: 'login',

    following: 2,
    followers: 0,
    posts: 3,
  }),
  actions: {
    toggleMode(modeInput) {
      this.mode = modeInput
    },
    login(email) {
      this.currentUser = email
      this.isLoggedIn = true
    },
    logout() {
      this.currentUser = ''
      this.isLoggedIn = false
    },

    incrementFollowing() {
      this.following += 1
    },
    incrementFollowers() {
      this.followers += 1
    },
  },
  getters: {
    isLogin: (state) => state.mode === 'login',
    isViewingAnotherUser: (state) => state.viewingUser !== '',
  },
})
