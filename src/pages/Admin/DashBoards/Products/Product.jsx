import React, { useContext, useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/layout/Layout";
import myContext from "../../../../Library/MyContext";

const Product = () => {
  const { product, deleteProduct, edithandle, getProductData } = useContext(myContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProductData();
  }, []);

  const categories = [...new Set(product.flatMap(item => item.category))];

  const filteredProducts = product.filter((item) => {
    const isCategoryMatch = !selectedCategory || item.category.includes(selectedCategory);
    const isTitleMatch = !searchTitle || item.title.toLowerCase().includes(searchTitle.toLowerCase());
    return isCategoryMatch && isTitleMatch;
  });

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 to-neutral-100 dark:from-gray-950 dark:to-neutral-950 transition-all text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Product Details</h1>

        {/* Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <select
            className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 px-4 py-2 rounded-md shadow-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 px-4 py-2 rounded-md shadow-sm"
            placeholder="Search by Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>

        {/* Add Product Button */}
        <div className="text-right m-4">
          <button
            onClick={() => navigate("/Admin-Products-Add")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-all flex items-center gap-2"
          >
            <FaCartPlus /> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
              <tr>
                <th className="px-6 py-3">S.No</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => (
                <tr key={item.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <img src={item.imageUrl} alt="Product" className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">₹{item.price}</td>
                  <td className="px-6 py-4">{item.category.join(", ")}</td>
                  <td className="px-6 py-4">
                    {item.time ? new Date(item.time.seconds * 1000).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        edithandle(item);
                        navigate(`/Admin-Products-Edit/${item.id}`);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
