import { doc, getDoc, getDocs, collection } from "firebase/firestore"
import { firestore } from "../firebaseResources"

export const getFollowerCount = async (id) => {
  try {
    const userRef = doc(firestore, 'users', id)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const followers = data.followers || []
      return followers.length
    }
  } catch (error) {
    console.error('Failed to get follower count:', error)
    return 0
  }
}
export const getFollowingCount = async (id) => {
  try {
    const userRef = doc(firestore, 'users', id)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const following = data.following || []
      return following.length
    }
  } catch (error) {
    console.error('Failed to get following count:', error)
    return 0
  }
}
export const getPostCount = async (id) => {
  try {
    const postRef = collection(firestore, 'users', id, 'posts')
    const snapshot = await getDocs(postRef)

    return snapshot.size
  } catch (error) {
    console.error('Failed to get posts count:', error)
    return 0
  }
}
