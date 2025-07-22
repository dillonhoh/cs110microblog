<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { firestore } from '@/firebaseResources'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import jsPDF from 'jspdf'

const store = useUserStore()
const route = useRoute()
const userId = ref(store.viewingUserId)

const downloadPDF = async () => {
  const userRef = doc(firestore, 'users', userId.value)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    alert('User not found.')
    return
  }

  const userData = userSnap.data()


  const getEmailsFromIds = async (ids) => {
    const emails = []
    for (const id of ids) {
      const snap = await getDoc(doc(firestore, 'users', id))
      if (snap.exists()) {
        const data = snap.data()
        emails.push(data.email || '(no email)')
      }
    }
    return emails
  }

  const followerIds = userData.followers || []
    const followingIds = userData.following || []

  const [followerEmails, followingEmails] = await Promise.all([
    getEmailsFromIds(followerIds),
    getEmailsFromIds(followingIds)
  ])

  const postsSnap = await getDocs(collection(firestore, 'users', userId.value, 'posts'))
  const posts = []
  postsSnap.forEach(doc => {
    const post = doc.data()
    posts.push({
      content: post.content || '',
      createdAt: post.createdAt?.toDate()?.toLocaleString() || 'Unknown'
    })
  })

  // Generate PDF
  const pdf = new jsPDF()
  let y = 10

  pdf.setFontSize(16)
  pdf.text(`User Snapshot: ${userData.displayName || userData.email}`, 10, y)
  y += 10

  pdf.setFontSize(10)
  pdf.text(`Downloaded: ${new Date().toLocaleString()}`, 10, y)
  y += 10

  pdf.setFontSize(12)
  pdf.text(`Email: ${userData.email}`, 10, y)
  y += 10

  const writeList = (title, items) => {
    if (y > 270) { pdf.addPage(); y = 10 }
    pdf.setFontSize(12)
    pdf.text(`${title} (${items.length}):`, 10, y)
    y += 8
    pdf.setFontSize(10)
    for (const item of items) {
      if (y > 270) { pdf.addPage(); y = 10 }
      pdf.text(`- ${item}`, 12, y)
      y += 6
    }
    y += 4
  }

  writeList('Followers', followerEmails)
  writeList('Following', followingEmails)

  // Posts section
  pdf.setFontSize(12)
  pdf.text(`Posts (${posts.length}):`, 10, y)
  y += 8
  pdf.setFontSize(10)

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    if (y > 270) { pdf.addPage(); y = 10 }

    pdf.text(`${i + 1}. ${post.createdAt}`, 10, y)
    y += 6

    const lines = pdf.splitTextToSize(post.content, 180)
    pdf.text(lines, 12, y)
    y += lines.length * 5 + 2
  }

  pdf.save(`${userData.displayName || 'profile'}_snapshot.pdf`)
}
</script>



<template>
    <button @click="downloadPDF">Download</button>
</template>