import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: '',
    currentUserId: '',
    viewingUser: '',
    viewingUserId: '',
    isLoggedIn: false,
    mode: 'login',

    followingCount: 1,
    followerCount: 1,
    postsCount: 1,

    postUpdateTrigger: 0,
    statsRefreshTrigger: 0,
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

    triggerPostUpdate() {
      this.postUpdateTrigger++
    },
    triggerStatsRefresh() {
      this.statsRefreshTrigger++
    }
  },
  getters: {
    isLogin: (state) => state.mode === 'login',
    isViewingAnotherUser: (state) => state.viewingUser !== '',
  },
})
