import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../../../Library/MyContext";
import Layout from "../../../../components/layout/Layout";

const AddProduct = () => {
  const { products, setProducts, addProduct, loading } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts({
      title: "",
      price: "",
      imageUrl: "",
      category: [],
      location: "",
      description: "",
    });
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center px-4 py-12 bg-gradient-to-br from-purple-100 to-neutral-100 dark:from-gray-950 dark:to-neutral-950 transition-all">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 transition-all">
          <h1 className="text-center text-gray-900 dark:text-white text-2xl font-bold mb-6">
            Add Product
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addProduct(() => navigate("/products"));
            }}
          >
            <input
              type="text"
              value={products.title}
              onChange={(e) => setProducts({ ...products, title: e.target.value })}
              placeholder="Product title"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-4 px-3 py-2 w-full rounded-lg outline-none transition"
              required
            />

            <input
              type="number"
              value={products.price}
              onChange={(e) => setProducts({ ...products, price: e.target.value })}
              placeholder="Product price"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-4 px-3 py-2 w-full rounded-lg outline-none transition"
              required
            />

            <input
              type="text"
              value={products.imageUrl}
              onChange={(e) => setProducts({ ...products, imageUrl: e.target.value })}
              placeholder="Product image URL"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-4 px-3 py-2 w-full rounded-lg outline-none transition"
              required
            />

            <input
              type="text"
              value={Array.isArray(products.category) ? products.category.join(", ") : products.category}
              onChange={(e) =>
                setProducts({
                  ...products,
                  category: e.target.value.split(",").map((cat) => cat.trim()),
                })
              }
              placeholder="Product category (comma separated)"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-4 px-3 py-2 w-full rounded-lg outline-none transition"
              required
            />

            <input
              type="text"
              value={products.location}
              onChange={(e) => setProducts({ ...products, location: e.target.value })}
              placeholder="Product location"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-4 px-3 py-2 w-full rounded-lg outline-none transition"
            />

            <textarea
              rows="4"
              value={products.description}
              onChange={(e) => setProducts({ ...products, description: e.target.value })}
              placeholder="Product description"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300 mb-6 px-3 py-2 w-full rounded-lg outline-none transition"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 rounded-lg transition"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
