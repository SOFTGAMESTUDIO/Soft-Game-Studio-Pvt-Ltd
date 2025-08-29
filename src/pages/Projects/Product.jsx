import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useFetchProducts from "../../Modules/FetchProducts";
import GoogleDriveDownloader from "../../Modules/GoogleDriveDownloader";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ProductsPage() {
  const { product, loading } = useFetchProducts();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Extract all unique categories
  const categories = product
    ? [...new Set(product.flatMap(item => 
        Array.isArray(item.category) ? item.category : [item.category]
      ))].filter(Boolean)
    : [];

  useEffect(() => {
    if (!product) return;

    let filtered = product.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (activeTab === "all" || 
         (Array.isArray(item.category) 
          ? item.category.includes(activeTab) 
          : item.category === (activeTab)
        ))
    );

    if (filterType === "paid") {
      filtered = filtered.filter((item) => parseInt(item.price) > 0);
    } else if (filterType === "free") {
      filtered = filtered.filter((item) => parseInt(item.price) === 0);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filterType, product, activeTab]);

  return (
    <Layout>
       <Helmet>
  <title>Projects | Soft Game Studio</title>
  <meta 
    name="description" 
    content="Explore a wide range of free and affordable software projects. Soft Game Studio offers pre-built, full-data projects for students, developers, and startups." 
  />
  <meta 
    name="keywords" 
    content="Free Projects, Affordable Projects, Pre-built Projects, Full Data Projects, Software Projects, Student Projects, Developer Resources, Soft Game Studio" 
  />
  <meta name="author" content="Soft Game Studio" />
  
  <meta property="og:title" content="Projects | Soft Game Studio" />
  <meta 
    property="og:description" 
    content="Get free and budget-friendly pre-built projects with full data at Soft Game Studio. Ideal for learning, development, and academic use." 
  />
  <meta property="og:url" content="https://softgamestudios.web.app/Projects" />
  <meta property="og:type" content="website" />
  <meta 
    property="og:image" 
    content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" 
  />
</Helmet>

      <div className="bg-purple-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-200 min-h-screen flex flex-col">

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-purple-600 dark:bg-neutral-900">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-purple-800/30 dark:bg-neutral-900/80 mix-blend-multiply"></div>
          </div>
          <div className="relative pt-32 pb-24 sm:pt-48 sm:pb-32 lg:pt-56 lg:pb-40">
            <div className="container mx-auto px-6 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Our Projects
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-6 max-w-3xl mx-auto text-xl text-purple-100 dark:text-cyan-100"
              >
                Explore our collection of projects across various categories.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="container mx-auto px-6 mt-10 flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 rounded-lg border border-purple-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 rounded-lg border border-purple-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="container mx-auto px-6 mt-8">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("all")}
              className={`mr-2 py-3 px-6 font-medium text-sm rounded-t-lg ${
                activeTab === "all"
                  ? "bg-purple-600 dark:bg-cyan-600 text-white"
                  : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`mr-2 py-3 px-6 font-medium text-sm rounded-t-lg ${
                  activeTab === category
                    ? "bg-purple-600 dark:bg-cyan-600 text-white"
                    : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-6 flex-grow mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.p 
              className="text-center text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No projects found matching your criteria.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {filteredProducts.map(({ id, title, price, imageUrl, category, location }) => (
                <motion.div
                  key={id}
                  className="group"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-full bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-neutral-800 flex flex-col transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/20">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-5 flex-grow">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {(Array.isArray(category) ? category : [category]).join(", ")}
                      </p>
                    </div>

                    <div className="px-5 pb-5">
                      {price > 0 ? (
                        <div className="flex justify-between gap-3">
                          <button
                            onClick={() => addToCart({ id, title, price, imageUrl, category })}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            ₹{price} Add to Cart
                          </button>
                          <Link
                            to={`/Project-Details/${id}`}
                            className="flex-1 px-4 py-2 text-center border border-gray-300 dark:border-neutral-700 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      ) : (
                        <GoogleDriveDownloader location={location} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-purple-600 dark:bg-neutral-900 py-16 mt-12">
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Need help with your projects?
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-100 dark:text-cyan-100 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Contact our support team for any questions or assistance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/ContactUs"
                className="bg-white hover:bg-gray-100 text-purple-600 dark:text-neutral-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
              >
                Contact Support
              </Link>
              <Link
                to="/courses"
                className="bg-transparent hover:bg-purple-700 dark:hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-full text-lg border-2 border-white transition-all duration-300"
              >
                Browse Courses
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
