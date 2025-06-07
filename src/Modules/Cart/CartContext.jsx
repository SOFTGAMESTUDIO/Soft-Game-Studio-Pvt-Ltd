import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getLocalCart,
  setLocalCart,
  getFirebaseCart,
  setFirebaseCart,
  mergeCarts
} from "./cartUtils";
import { doc, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // 🔁 Real-time Firebase cart sync
  useEffect(() => {
    if (!user) return;
    const cartRef = doc(fireDB, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.items) setCartItems(data.items);
    });
    return () => unsubscribe();
  }, [user]);

  // 🔄 Load user and initial cart
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    loadCart(storedUser);
  }, []);

  // 🧠 LocalStorage sync across tabs
  useEffect(() => {
    const onStorageChange = (e) => {
      if (e.key === "cart" && !user) {
        const local = getLocalCart();
        setCartItems(local);
      }
      if (e.key === "user") {
        const newUser = JSON.parse(e.newValue);
        setUser(newUser);
        loadCart(newUser);
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [user]);

  const loadCart = useCallback(async (user) => {
    if (user) {
      const local = getLocalCart();
      const firebase = await getFirebaseCart(user.uid);
      const merged = mergeCarts(firebase, local);
      await setFirebaseCart(user.uid, merged);
      setLocalCart([]); // clear local cart after sync
    } else {
      setCartItems(getLocalCart());
    }
  }, []);

  const updateCart = useCallback(async (items) => {
    setCartItems(items);
    if (user) {
      await setFirebaseCart(user.uid, items);
    } else {
      setLocalCart(items);
    }
  }, [user]);

  // ✅ Feature 1: Smart addToCart
  const addToCart = useCallback(async (item) => {
    if (!user) {
      setCartItems((prev) => {
        const existing = prev.find(i => i.id === item.id);
        const updated = existing
          ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { ...item, quantity: 1 }];
        setLocalCart(updated);
        return updated;
      });
    } else {
      const firebaseCart = await getFirebaseCart(user.uid);
      const existing = firebaseCart.find(i => i.id === item.id);

      if (!existing) {
        // Item not in Firebase – add it
        const updatedCart = [...firebaseCart, { ...item, quantity: 1 }];
        await setFirebaseCart(user.uid, updatedCart);
        // cartItems will auto update via onSnapshot
      } else {
        // Already in Firebase – update only in localStorage
        setLocalCart((prev) => {
          const local = prev.find(i => i.id === item.id);
          const updated = local
            ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...prev, { ...item, quantity: 1 }];
          return updated;
        });
      }
    }
  }, [user]);

  const removeFromCart = useCallback(async (id) => {
    if (!user) {
      setCartItems((prev) => {
        const updated = prev.filter(i => i.id !== id);
        setLocalCart(updated);
        return updated;
      });
    } else {
      const firebaseCart = await getFirebaseCart(user.uid);
      const updatedCart = firebaseCart.filter(i => i.id !== id);
      await setFirebaseCart(user.uid, updatedCart);
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (user) {
      await setFirebaseCart(user.uid, []);
    } else {
      setLocalCart([]);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
