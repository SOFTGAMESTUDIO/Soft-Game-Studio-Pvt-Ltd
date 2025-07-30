import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { useAuth } from "../../AuthProvide";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🧠 Load Firebase cart in real-time when user is logged in
  useEffect(() => {
    if (!user) {
      setCartItems([]); // Clear cart when user logs out
      return;
    }

    const cartRef = doc(fireDB, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.items) setCartItems(data.items);
    });

    return () => unsubscribe();
  }, [user]);

  const updateCart = useCallback(async (items) => {
    if (!user) return console.warn("You must be logged in to update cart.");
    setCartItems(items);
    await setFirebaseCart(user.uid, items);
  }, [user]);

  const addToCart = useCallback(async (item) => {
    if (!user) return console.warn("You must be logged in to add items to cart.");

    const firebaseCart = await getFirebaseCart(user.uid);
    const existing = firebaseCart.find(i => i.id === item.id);

    const updatedCart = existing
      ? firebaseCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...firebaseCart, { ...item, quantity: 1 }];

    await setFirebaseCart(user.uid, updatedCart);
  }, [user]);

  const removeFromCart = useCallback(async (id) => {
    if (!user) return console.warn("You must be logged in to remove items from cart.");

    const firebaseCart = await getFirebaseCart(user.uid);
    const updatedCart = firebaseCart.filter(i => i.id !== id);
    await setFirebaseCart(user.uid, updatedCart);
  }, [user]);

  const clearCart = useCallback(async () => {
    if (!user) return console.warn("You must be logged in to clear cart.");

    setCartItems([]);
    await setFirebaseCart(user.uid, []);
  }, [user]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
