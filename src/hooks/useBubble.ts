import { useState, useEffect } from 'react'
import { getBubbleBySlug } from '@/lib/client-db/services/bubble'
import { Bubble } from '@/lib/db/interfaces/bubble'

export const useBubbleBySlug = (slug: string): Bubble | null => {
  const [bubble, setBubble] = useState<Bubble | null>(null)

  useEffect(() => {
    const fetchBubbleBySlug = async () => {
      try {
        const fetchedBubble = await getBubbleBySlug(slug)
        setBubble(fetchedBubble)
      } catch (error) {
        console.error('Error fetching bubble:', error)
      }
    }

    fetchBubbleBySlug()
  }, [slug])

  return bubble
}
