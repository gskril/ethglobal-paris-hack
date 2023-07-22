import { useState, useEffect } from 'react'
import { getBubbleBySlug } from '@/lib/client-db/services/bubble'
import { Bubble } from '@/lib/db/interfaces/bubble'
import { getUserById } from '@/lib/client-db/services/user'
import { User } from '@/lib/db/interfaces/user'

export const useBubble = (slug: string) => {
  const [bubble, setBubble] = useState<Bubble | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchBubbleBySlug = async () => {
      try {
        const fetchedBubble = await getBubbleBySlug(slug)
        setBubble(fetchedBubble)

        if (fetchedBubble) {
          const fetchedUser = await getUserById(fetchedBubble.userId)
          setUser(fetchedUser)
        }
      } catch (error) {
        console.error('Error fetching bubble:', error)
      }
    }

    fetchBubbleBySlug()
  }, [slug])

  return { bubble, user }
}
