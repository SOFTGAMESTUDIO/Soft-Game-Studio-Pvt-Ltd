"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";

const Cart = () => {
const { cartItems, removeFromCart, clearCart } = useCart();
const [totalAmount, setTotalAmount] = useState(0);
const [subAmount, setSubAmount] = useState(0);
const [taxAmount, setTaxAmount] = useState(0);

const { scrollYProgress } = useScroll();
const translateY = useTransform(scrollYProgress, [0, 1], [0, -100]);

useEffect(() => {
  if (!cartItems || cartItems.length === 0) {
    setSubAmount(0);
    setTaxAmount(0);
    setTotalAmount(0);
    return;
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseInt(item.price) || 0) * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.18;
  const shipping = 0; // Default shipping value
  const total = subtotal + tax + shipping;

  setSubAmount(subtotal);
  setTaxAmount(tax);
  setTotalAmount(total);
}, [cartItems]);

const handleDelete = (id) => {
  removeFromCart(id);
};

const handleBuyNow = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    toast.error("User not logged in");
    return;
  }

  const zeroPriced = cartItems.filter((item) => (parseInt(item.price) || 0) === 0);
  const pricedItems = cartItems.filter((item) => (parseInt(item.price) || 0) > 0);

  // Handle free items
  for (const item of zeroPriced) {
    try {
      const docRef = await addDoc(collection(fireDB, "orders"), {
        ...item,
        quantity: item.quantity || 1,
        date: new Date().toLocaleDateString(),
        email: user.email,
        userId: user.uid,
        paymentId: "FREE",
      });
      await updateDoc(docRef, { orderId: docRef.id });
    } catch (err) {
      console.error("Free order failed", err);
      toast.error("Failed to order free items");
      return;
    }
  }

  if (zeroPriced.length > 0) toast.success("Free items ordered!");

  // Handle paid items with Razorpay
  if (pricedItems.length > 0) {
    const total = pricedItems.reduce(
      (sum, item) => sum + (parseInt(item.price) || 0) * (item.quantity || 1),
      0
    );

    const options = {
      key: import.meta.env.VITE__RAZORPAY_KEY,
      amount: total * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "SOft Game Studio",
      description: "Purchase",
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        try {
          for (const item of pricedItems) {
            const docRef = await addDoc(collection(fireDB, "orders"), {
              ...item,
              quantity: item.quantity || 1,
              paymentId,
              date: new Date().toLocaleDateString(),
              email: user.email,
              userId: user.uid,
            });
            await updateDoc(docRef, { orderId: docRef.id });
          }
          toast.success("Payment successful!");
          clearCart();
          window.location.href = "/orders";
        } catch (err) {
          toast.error("Order saving failed");
          console.error(err);
        }
      },
      theme: { color: "#6B46C1" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }
};


  return (
    <Layout>
  <motion.div
    style={{ y: translateY }}
    className="min-h-screen py-10 px-4 transition-colors duration-500 bg-purple-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-200"
  >
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl text-center font-bold mb-10"
    >
      Shopping Cart
    </motion.h1>

    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-neutral-900 shadow-lg rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-300 text-sm uppercase font-semibold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                  </td>
                </tr>
              ) : (
                cartItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-16 w-16 rounded-md object-contain"
                      />
                    </td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4 text-right">₹{item.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 mt-8"
      >
        <div className="space-y-4 text-gray-800 dark:text-gray-200">
          <div className="flex justify-between text-lg font-medium">
            <span>Subtotal</span>
            <span>₹{subAmount}</span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span>Tax</span>
            <span>₹{taxAmount}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-4 border-gray-300 dark:border-gray-700">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={cartItems.length === 0}
          className={`w-full mt-6 py-3 rounded-lg text-sm font-semibold transition text-white ${
            cartItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-800"
          }`}
        >
          Checkout Now
        </button>
      </motion.div>
    </div>
  </motion.div>
</Layout>

  
  );
};

export default Cart;
