import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD9WtsAEobaS4qQ-D3z-ByGdKGJ5PVfvQo',
  authDomain: 'leskita.firebaseapp.com',
  projectId: 'leskita',
  storageBucket: 'leskita.firebasestorage.app',
  messagingSenderId: '826915862685',
  appId: '1:826915862685:web:1443f2cfdbe8ec3d333c74',
  measurementId: 'G-PT7DJCN77K',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);