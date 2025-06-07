// /utils/cartUtils.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";

// LOCAL CART UTILS
export const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

export const setLocalCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// FIREBASE CART UTILS
export const getFirebaseCart = async (uid) => {
  const docRef = doc(fireDB, "carts", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().items || [] : [];
};

export const setFirebaseCart = async (uid, cart) => {
  const docRef = doc(fireDB, "carts", uid);
  await setDoc(docRef, { items: cart }, { merge: true });
};

// SYNC LOCAL TO FIREBASE
export const mergeCarts = (firebaseCart, localCart) => {
  const mergedMap = new Map();

  [...firebaseCart, ...localCart].forEach(item => {
    if (mergedMap.has(item.id)) {
      const existing = mergedMap.get(item.id);
      existing.quantity += item.quantity || 1;
    } else {
      mergedMap.set(item.id, { ...item, quantity: item.quantity || 1 });
    }
  });

  return Array.from(mergedMap.values());
};
