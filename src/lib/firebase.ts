import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type {
  AIProposalContent,
  BrandingSettings,
  ProposalFormData,
  ProposalStatus,
  SavedProposalDraft,
  TrainerProfile,
} from '../types/proposal';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

export type OperationTypeValue = (typeof OperationType)[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationTypeValue;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationTypeValue,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}

export function subscribeUserProposals(
  userId: string,
  onData: (proposals: SavedProposalDraft[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'proposals';
  const q = query(collection(db, path), where('ownerId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: SavedProposalDraft[] = snapshot.docs
        .map((snap) => {
          const data = snap.data();
          const createdAt =
            typeof data.createdAt?.toDate === 'function'
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString();
          const updatedAt =
            typeof data.updatedAt?.toDate === 'function'
              ? data.updatedAt.toDate().toISOString()
              : createdAt;

          return {
            id: snap.id,
            createdAt,
            updatedAt,
            status: (data.status as ProposalStatus) || 'Draf',
            isCloud: true,
            formData: data.formData as ProposalFormData,
            aiContent: data.aiContent as AIProposalContent,
          };
        })
        .sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

export async function saveProposalToCloud(
  userId: string,
  proposalId: string,
  status: ProposalStatus,
  formData: ProposalFormData,
  aiContent: AIProposalContent,
  totalBudget: number,
  isExistingCloudDoc: boolean
): Promise<void> {
  const cleanId = proposalId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || `prop_${Date.now()}`;
  const path = `proposals/${cleanId}`;
  const ref = doc(db, 'proposals', cleanId);

  const safeTitle = (formData.namaProgram || 'Kertas Kerja').trim().slice(0, 240);
  const safeCompany = (formData.namaSyarikat || 'Klien').trim().slice(0, 240);
  const safeStartDate = (formData.tarikhMula || new Date().toISOString().slice(0, 10)).slice(0, 20);

  try {
    if (isExistingCloudDoc) {
      await updateDoc(ref, {
        status,
        title: safeTitle,
        companyName: safeCompany,
        bahasa: formData.bahasa,
        totalBudget: Number(totalBudget) || 0,
        days: Math.max(1, Math.min(30, Number(formData.bilanganHari) || 1)),
        participants: Math.max(1, Math.min(10000, Number(formData.bilanganPeserta) || 1)),
        startDate: safeStartDate,
        formData,
        aiContent,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId: userId,
        status,
        title: safeTitle,
        companyName: safeCompany,
        bahasa: formData.bahasa,
        totalBudget: Number(totalBudget) || 0,
        days: Math.max(1, Math.min(30, Number(formData.bilanganHari) || 1)),
        participants: Math.max(1, Math.min(10000, Number(formData.bilanganPeserta) || 1)),
        startDate: safeStartDate,
        formData,
        aiContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, isExistingCloudDoc ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function updateProposalStatusInCloud(
  proposalId: string,
  status: ProposalStatus
): Promise<void> {
  const path = `proposals/${proposalId}`;
  try {
    await updateDoc(doc(db, 'proposals', proposalId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProposalFromCloud(proposalId: string): Promise<void> {
  const path = `proposals/${proposalId}`;
  try {
    await deleteDoc(doc(db, 'proposals', proposalId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function loadUserSettingsFromCloud(
  userId: string
): Promise<{ branding?: BrandingSettings; trainerProfile?: TrainerProfile } | null> {
  const path = `userSettings/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'userSettings', userId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      branding: data.branding as BrandingSettings | undefined,
      trainerProfile: data.trainerProfile as TrainerProfile | undefined,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserSettingsToCloud(
  userId: string,
  branding: BrandingSettings,
  trainerProfile: TrainerProfile
): Promise<void> {
  const path = `userSettings/${userId}`;
  const ref = doc(db, 'userSettings', userId);
  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        branding,
        trainerProfile,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId: userId,
        branding,
        trainerProfile,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
