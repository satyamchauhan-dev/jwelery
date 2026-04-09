import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export type FavoriteItem = {
  id: string;
  imageUrl: string;
  imagePath: string;
  imageHash: string;
  prompt: string;
  metal: string;
  category: string;
  style: string;
  weight: number;
  details: string;
  createdAt: string;
};

export type LedgerItem = {
  id: string;
  imageUrl: string;
  imagePath: string;
  imageHash: string;
  prompt: string;
  metal: string;
  category: string;
  style: string;
  weight: number;
  details: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  advancePayment: string;
  orderNotes: string;
  createdAt: string;
};

type GeneratedImageMetadata = {
  id: string;
  imageUrl: string;
  imagePath: string;
  imageHash: string;
  prompt: string;
  metal: string;
  category: string;
  style: string;
  weight: number;
  details: string;
  createdAt: string;
};

const userDoc = (uid: string) => doc(db, 'users', uid);
const favoritesCollection = (uid: string) => collection(userDoc(uid), 'favorites');
const ledgerCollection = (uid: string) => collection(userDoc(uid), 'orders');
const generatedCollection = (uid: string) => collection(userDoc(uid), 'generatedImages');

const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
const nowIso = () => new Date().toISOString();

const toBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

const sha256Hex = async (blob: Blob) => {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('');
};

export async function uploadGeneratedImageForUser(uid: string, imageDataUrl: string) {
  const imageBlob = await toBlob(imageDataUrl);
  const imageHash = await sha256Hex(imageBlob);

  const existingDoc = await getDoc(doc(generatedCollection(uid), imageHash));
  if (existingDoc.exists()) {
    const existing = existingDoc.data() as Partial<GeneratedImageMetadata>;
    if (existing.imageUrl && existing.imagePath) {
      return {
        imageUrl: existing.imageUrl,
        imagePath: existing.imagePath,
        imageHash,
      };
    }
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env',
    );
  }

  const formData = new FormData();
  formData.append('file', imageBlob, `design-${imageHash}.png`);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `jwelery/${uid}`);
  formData.append('public_id', imageHash);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error?.message ?? 'Cloudinary upload failed.';
    throw new Error(message);
  }

  const imageUrl = payload.secure_url as string | undefined;
  const publicId = payload.public_id as string | undefined;

  if (!imageUrl || !publicId) {
    throw new Error('Cloudinary response is missing secure_url/public_id.');
  }

  const imagePath = `cloudinary://${publicId}`;
  return { imageUrl, imagePath, imageHash };
}

export async function saveGeneratedImageMetadata(
  uid: string,
  metadata: Omit<GeneratedImageMetadata, 'id' | 'createdAt'>,
) {
  const generatedDoc = doc(generatedCollection(uid), metadata.imageHash);
  await setDoc(
    generatedDoc,
    {
      ...metadata,
      createdAt: nowIso(),
    },
    { merge: true },
  );
}

export async function addFavorite(uid: string, item: Omit<FavoriteItem, 'id' | 'createdAt'>) {
  const id = createId('fav');
  const favoriteDoc = doc(favoritesCollection(uid), id);
  await setDoc(favoriteDoc, {
    ...item,
    createdAt: nowIso(),
  });
  return id;
}

export async function removeFavorite(uid: string, favoriteId: string) {
  await deleteDoc(doc(favoritesCollection(uid), favoriteId));
}

export async function listFavorites(uid: string) {
  const snapshot = await getDocs(query(favoritesCollection(uid), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => {
    const data = item.data() as Omit<FavoriteItem, 'id'>;
    return {
      id: item.id,
      ...data,
    };
  });
}

export async function favoriteExistsByHash(uid: string, imageHash: string) {
  const snapshot = await getDocs(
    query(favoritesCollection(uid), where('imageHash', '==', imageHash), limit(1)),
  );
  return !snapshot.empty;
}

export async function addOrder(uid: string, item: Omit<LedgerItem, 'id' | 'createdAt'>) {
  const orderRef = await addDoc(ledgerCollection(uid), {
    ...item,
    createdAt: nowIso(),
  });
  return orderRef.id;
}

export async function listOrders(uid: string) {
  const snapshot = await getDocs(query(ledgerCollection(uid), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => {
    const data = item.data() as Omit<LedgerItem, 'id'>;
    return {
      id: item.id,
      ...data,
    };
  });
}

export async function getImageUrlFromPath(imagePath: string) {
  if (imagePath.startsWith('cloudinary://')) {
    return imagePath;
  }
  return imagePath;
}

export async function ensureFavoriteUrls(_uid: string) {
  // No-op: Cloudinary URL is stored directly in Firestore.
}

export async function ensureLedgerUrls(_uid: string) {
  // No-op: Cloudinary URL is stored directly in Firestore.
}

export async function hasGeneratedImage(uid: string, imageHash: string) {
  const generatedDoc = await getDoc(doc(generatedCollection(uid), imageHash));
  return generatedDoc.exists();
}
