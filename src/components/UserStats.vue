<script setup>
import { useUserStore } from '../stores/user'
const store = useUserStore()


</script>
<template>
    <div class="user-stats">
    <h1 v-if="store.isViewingAnotherUser" class="user-email">
        {{ store.viewingUser }}
    </h1>
    <h1 v-else class="user-email">
        {{ store.currentUser }}
    </h1>
    <div class="profile-stats">
        <div class="stat">
            <div>Posts</div>
            <div class="stat-number">{{ store.posts }}</div>
        </div>
            <div class="stat">
            <div>Following</div>
        <div class="stat-number">{{ store.following }}</div>
        </div>
            <div class="stat">
            <div>Followers</div>
        <div class="stat-number">{{ store.followers }}</div>
        </div>
  </div>
  </div>
</template>
<style>
.user-stats{
    background-color: lightblue;
    width: 300px;
    padding: 15px 0px 15px 0px;
    height: 100px;
    
}
.user-email{
    font-size: 20px;
    margin-left: 22px;
    font-weight: bold;
}
.profile-stats {
    display: flex;
    justify-content: space-around;
        
}
</style>