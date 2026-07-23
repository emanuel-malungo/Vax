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
  serverTimestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../index";
import { AppError } from "@/utils/errors/AppError";
import { Logger } from "@/utils/logger/Logger";

export const COLLECTIONS = {
  USERS: "users",
  CAMPAIGNS: "campaigns",
  CONTRIBUTIONS: "contributions",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
  LOGS: "logs",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export async function getDocument<T = DocumentData>(collectionName: CollectionName, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T;
  } catch (error) {
    Logger.error(`Erro ao obter documento ${collectionName}/${docId}`, error);
    throw AppError.fromError(error, "Erro ao carregar dados.");
  }
}

export async function setDocument<T extends Record<string, any>>(
  collectionName: CollectionName,
  docId: string,
  data: T,
  merge = true
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(merge ? {} : { createdAt: serverTimestamp() }),
    };
    await setDoc(docRef, payload, { merge });
    Logger.info(`Documento guardado em ${collectionName}/${docId}`);
  } catch (error) {
    Logger.error(`Erro ao gravar documento em ${collectionName}/${docId}`, error);
    throw AppError.fromError(error, "Erro ao guardar dados.");
  }
}

export async function updateDocument<T extends Record<string, any>>(
  collectionName: CollectionName,
  docId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    Logger.info(`Documento atualizado em ${collectionName}/${docId}`);
  } catch (error) {
    Logger.error(`Erro ao atualizar documento em ${collectionName}/${docId}`, error);
    throw AppError.fromError(error, "Erro ao atualizar dados.");
  }
}

export async function deleteDocument(collectionName: CollectionName, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    Logger.info(`Documento apagado em ${collectionName}/${docId}`);
  } catch (error) {
    Logger.error(`Erro ao apagar documento em ${collectionName}/${docId}`, error);
    throw AppError.fromError(error, "Erro ao apagar dados.");
  }
}

export async function queryDocuments<T = DocumentData>(
  collectionName: CollectionName,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    Logger.error(`Erro na consulta à coleção ${collectionName}`, error);
    throw AppError.fromError(error, "Erro ao consultar dados.");
  }
}

export { where, orderBy, limit, serverTimestamp };
