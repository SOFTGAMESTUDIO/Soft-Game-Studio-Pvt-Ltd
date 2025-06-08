import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../../components/layout/Layout";
import myContext from "../../../../Library/MyContext";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts, updateProduct, getProductById, loading } = useContext(myContext);

  useEffect(() => {
    if (id) {
      getProductById(id).then((prod) => {
        if (prod) {
          setProducts({
            ...prod,
            category: Array.isArray(prod.category) ? prod.category : [],
          });
        }
      });
    }
  }, [id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-neutral-100 dark:from-gray-950 dark:to-neutral-950 flex justify-center items-center px-6 py-12 transition-all duration-300">
        <div className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Update Product
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProduct(id, () => navigate("/products"));
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={products.title}
              onChange={(e) => setProducts({ ...products, title: e.target.value })}
              placeholder="Product title"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            />

            <input
              type="number"
              value={products.price}
              onChange={(e) => setProducts({ ...products, price: e.target.value })}
              placeholder="Product price"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            />

            <input
              type="text"
              value={products.imageUrl}
              onChange={(e) => setProducts({ ...products, imageUrl: e.target.value })}
              placeholder="Product image URL"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
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
              placeholder="Product categories (comma separated)"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              required
            />

            <input
              type="text"
              value={products.location}
              onChange={(e) => setProducts({ ...products, location: e.target.value })}
              placeholder="Product location"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />

            <textarea
              rows="4"
              value={products.description}
              onChange={(e) => setProducts({ ...products, description: e.target.value })}
              placeholder="Product description"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
