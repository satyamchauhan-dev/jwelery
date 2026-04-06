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

const favoritesKey = (uid: string) => `komal:favorites:${uid}`;
const ledgerKey = (uid: string) => `komal:ledger:${uid}`;
const generatedKey = (uid: string) => `komal:generated:${uid}`;

const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const readArray = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeArray = <T>(key: string, value: T[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

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

  // Local-only mode: keep image directly in browser storage flow.
  const imagePath = `local://${uid}/images/${imageHash}.png`;
  return { imageUrl: imageDataUrl, imagePath, imageHash };
}

export async function saveGeneratedImageMetadata(
  uid: string,
  metadata: Omit<GeneratedImageMetadata, 'id' | 'createdAt'>,
) {
  const key = generatedKey(uid);
  const items = readArray<GeneratedImageMetadata>(key);
  const next: GeneratedImageMetadata = {
    id: metadata.imageHash,
    ...metadata,
    createdAt: new Date().toISOString(),
  };

  const filtered = items.filter((item) => item.imageHash !== metadata.imageHash);
  writeArray(key, [next, ...filtered]);
}

export async function addFavorite(uid: string, item: Omit<FavoriteItem, 'id' | 'createdAt'>) {
  const key = favoritesKey(uid);
  const items = readArray<FavoriteItem>(key);
  const next: FavoriteItem = {
    id: createId('fav'),
    ...item,
    createdAt: new Date().toISOString(),
  };

  writeArray(key, [next, ...items]);
  return next.id;
}

export async function removeFavorite(uid: string, favoriteId: string) {
  const key = favoritesKey(uid);
  const items = readArray<FavoriteItem>(key);
  writeArray(
    key,
    items.filter((item) => item.id !== favoriteId),
  );
}

export async function listFavorites(uid: string) {
  const key = favoritesKey(uid);
  const items = readArray<FavoriteItem>(key);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function favoriteExistsByHash(uid: string, imageHash: string) {
  const key = favoritesKey(uid);
  const items = readArray<FavoriteItem>(key);
  return items.some((item) => item.imageHash === imageHash);
}

export async function addOrder(uid: string, item: Omit<LedgerItem, 'id' | 'createdAt'>) {
  const key = ledgerKey(uid);
  const items = readArray<LedgerItem>(key);
  const next: LedgerItem = {
    id: createId('order'),
    ...item,
    createdAt: new Date().toISOString(),
  };

  writeArray(key, [next, ...items]);
  return next.id;
}

export async function listOrders(uid: string) {
  const key = ledgerKey(uid);
  const items = readArray<LedgerItem>(key);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getImageUrlFromPath(imagePath: string) {
  return imagePath;
}

export async function ensureFavoriteUrls(_uid: string) {
  // No-op in local mode because image URLs are stored directly.
}

export async function ensureLedgerUrls(_uid: string) {
  // No-op in local mode because image URLs are stored directly.
}

export async function hasGeneratedImage(uid: string, imageHash: string) {
  const key = generatedKey(uid);
  const items = readArray<GeneratedImageMetadata>(key);
  return items.some((item) => item.imageHash === imageHash);
}
