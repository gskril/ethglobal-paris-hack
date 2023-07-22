import { isFirebasePushId } from 'class-validator'

import {
  createFirestoreCollectionDocument,
  deleteFirestoreCollectionDocument,
  getFirestoreCollectionDocumentById,
  getFirstFirestoreCollectionDocumentByWhereConditions,
} from '@/lib/db/firestore'
import { Bubble } from '@/lib/db/interfaces/bubble'

const COLLECTION_NAME = 'bubbles'

export async function getBubbleById(id: string): Promise<Bubble | null> {
  return await getFirestoreCollectionDocumentById<Bubble>(COLLECTION_NAME, id)
}

export async function getBubbleBySlug(slug: string): Promise<Bubble | null> {
  return await getFirstFirestoreCollectionDocumentByWhereConditions<Bubble>(
    COLLECTION_NAME,
    [
      {
        fieldPath: 'slug',
        opStr: '==',
        value: slug,
      },
    ]
  )
}

export async function createBubble(bubble: Bubble): Promise<string> {
  return await createFirestoreCollectionDocument(COLLECTION_NAME, bubble)
}

export async function deleteBubble(bubbleId: string): Promise<void> {
  return await deleteFirestoreCollectionDocument(COLLECTION_NAME, bubbleId)
}

export async function getBubbleByIdOrSlug(
  idOrSlug: string
): Promise<Bubble | null> {
  if (!idOrSlug) return null
  if (isFirebasePushId(idOrSlug)) return await getBubbleById(idOrSlug)
  return await getBubbleBySlug(idOrSlug)
}
