import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: '',
    currentUserId: '',
    viewingUser: '',
    isLoggedIn: false,
    mode: 'login',

    followingCount: 1,
    followerCount: 1,
    postsCount: 1,
  }),
  actions: {
    toggleMode(modeInput) {
      this.mode = modeInput
    },
    login(email, uid) {
      this.currentUser = email
      this.currentUserId = uid
      this.isLoggedIn = true
    },
    logout() {
      this.currentUser = ''
      this.currentUserId = ''
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
