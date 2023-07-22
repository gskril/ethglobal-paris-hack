import { useState, useEffect } from 'react'
import { getBubbles } from '@/lib/client-db/services/bubble'
import { Bubble } from '@/lib/db/interfaces/bubble'

export const useBubbles = (): Bubble[] | undefined => {
  const [bubbles, setBubbles] = useState<Bubble[] | undefined>(undefined)

  useEffect(() => {
    const fetchBubbles = async () => {
      try {
        const fetchedBubbles = await getBubbles()
        setBubbles(fetchedBubbles)
      } catch (error) {
        console.error('Error fetching bubbles:', error)
      }
    }

    fetchBubbles()
  }, [])

  return bubbles
}
