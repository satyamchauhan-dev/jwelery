import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDh8FiXf5azyvxkIhjIa3vaanXLRyw55Ps',
  authDomain: 'karan-jewelery.firebaseapp.com',
  projectId: 'karan-jewelery',
  storageBucket: 'karan-jewelery.firebasestorage.app',
  messagingSenderId: '456052651192',
  appId: '1:456052651192:web:bb3fd8e79413ea4ac5f04d',
  measurementId: 'G-WPBJ33J8WL',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Keep UI responsive when Storage is misconfigured or denied by rules.
storage.maxUploadRetryTime = 15000;
storage.maxOperationRetryTime = 10000;

void isSupported().then((supported) => {
  if (supported) {
    getAnalytics(firebaseApp);
  }
});
