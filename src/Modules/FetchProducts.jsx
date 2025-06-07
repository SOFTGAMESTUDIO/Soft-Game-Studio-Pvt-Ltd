// src/hooks/useFetchProducts.js
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig"; // Adjust the import path as needed

const useFetchProducts = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(fireDB, "products"), orderBy("time"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProduct(products);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { product, loading };
};

export default useFetchProducts;
