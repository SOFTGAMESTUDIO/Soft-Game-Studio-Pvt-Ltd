import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../../../DataBase/firebaseConfig";
import Layout from "../../../../components/layout/Layout";



const DashboardOrder = () => {
    const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");

  // Fetch orders from Firestore
  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "orders"));
      const ordersArray = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrder(ordersArray);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

  const handleDelete = async (docId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(fireDB, "orders", docId));
      setOrder((prev) => prev.filter((o) => o.id !== docId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = order
    .filter((order) => {
      const emailMatch = searchEmail
        ? order.email?.toLowerCase().includes(searchEmail.toLowerCase())
        : true;
      const idMatch = searchOrderId
        ? order.orderId?.toLowerCase().includes(searchOrderId.toLowerCase())
        : true;
      return emailMatch && idMatch;
    })
    .map((item) => ({
      ...item,
      title: item.title || "No Title",
      imageUrl: item.imageUrl || "fallback.jpg",
      price: item.price || 0,
      category: item.category || "N/A",
      paymentId: item.paymentId || "N/A",
      userId: item.userId || "N/A",
      email: item.email || "N/A",
      date: item.date || "N/A",
      orderId: item.orderId || "N/A",
    }));

  return (
    <Layout>
  <div className="container mx-auto p-6 dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6">Order Dashboard</h2>

      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="email"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 my-10">
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                {[
                  "Order ID",
                  "Payment ID",
                  "Image",
                  "Title",
                  "Price",
                  "Category",
                  "Email",
                  "User ID",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-gray-700 dark:text-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-900"
                  } border-b border-gray-200 dark:border-gray-700`}
                >
                  <td className="px-6 py-4">{order.orderId}</td>
                  <td className="px-6 py-4">{order.paymentId}</td>
                  <td className="px-6 py-4">
                    <img
                      src={order.imageUrl}
                      alt={order.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">{order.title}</td>
                  <td className="px-6 py-4">₹{order.price}</td>
                  <td className="px-6 py-4">{order.category}</td>
                  <td className="px-6 py-4">{order.email}</td>
                  <td className="px-6 py-4">{order.userId}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-12">
          <p>No orders found.</p>
        </div>
      )}
    </div>
    </Layout>
  
  );
};

export default DashboardOrder;
