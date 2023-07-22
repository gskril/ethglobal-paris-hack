import { DocumentData } from '@firebase/firestore-types'

import { firebase, firestore } from '@/lib/client-db'

interface WhereCondition {
  fieldPath: string | firebase.firestore.FieldPath
  opStr: firebase.firestore.WhereFilterOp
  value: any
}

export function getWhereConditionObject(
  fieldPath: string | firebase.firestore.FieldPath,
  opStr: firebase.firestore.WhereFilterOp,
  value: any
) {
  return { fieldPath, opStr, value }
}

export async function getFirestoreCollectionDocumentById<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  if (!id) return null
  const query = await firestore.collection(collectionName).doc(id).get()
  if (!query.exists) {
    return null
  }

  return { id: query.id, ...query.data() } as T
}

export async function getFirestoreCollectionDocumentsByWhereConditions<T>(
  collectionName: string,
  whereConditions: WhereCondition[]
): Promise<T[]> {
  let query: firebase.firestore.Query<firebase.firestore.DocumentData> =
    firestore.collection(collectionName)

  whereConditions.forEach(
    (whereCondition) =>
      (query = query.where(
        whereCondition.fieldPath,
        whereCondition.opStr,
        whereCondition.value
      ))
  )

  const queryResult = await query.get()
  if (queryResult.empty) {
    return []
  }

  const documents: T[] = []
  queryResult.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() } as T)
  })

  return documents
}

export async function getFirstFirestoreCollectionDocumentByWhereConditions<T>(
  collectionName: string,
  whereConditions: WhereCondition[]
): Promise<T | null> {
  const documents = await getFirestoreCollectionDocumentsByWhereConditions<T>(
    collectionName,
    whereConditions
  )
  if (!documents) {
    return null
  }

  return documents[0]
}

export async function updateFirestoreCollectionDocumentById<T>(
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<T | null> {
  await firestore
    .collection(collectionName)
    .doc(id)
    .update({ updatedAt: Date.now(), ...data })

  return getFirestoreCollectionDocumentById(collectionName, id)
}

export async function createFirestoreCollectionDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const doc = await firestore.collection(collectionName).add({
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  return doc.id
}

export async function deleteFirestoreCollectionDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  return await firestore.collection(collectionName).doc(docId).delete()
}
