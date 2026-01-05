import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/config/firebase";

type FirestoreDoc<T> = T & { id: string };

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<FirestoreDoc<T> | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreDoc<T>;
    }
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

export async function getCollection<T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<FirestoreDoc<T>[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q =
      queryConstraints.length > 0
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreDoc<T>[];
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
}

export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error setting document:", error);
    throw error;
  }
}

export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

export function subscribeToDocument<T>(
  collectionName: string,
  docId: string,
  callback: (data: FirestoreDoc<T> | null) => void
) {
  const docRef = doc(db, collectionName, docId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as FirestoreDoc<T>);
    } else {
      callback(null);
    }
  });
}

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: FirestoreDoc<T>[]) => void,
  ...queryConstraints: QueryConstraint[]
) {
  const collectionRef = collection(db, collectionName);
  const q =
    queryConstraints.length > 0
      ? query(collectionRef, ...queryConstraints)
      : collectionRef;

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreDoc<T>[];
    callback(docs);
  });
}

export { where, orderBy, limit };
