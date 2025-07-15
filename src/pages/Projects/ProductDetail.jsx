import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import useFetchProducts from "../../Modules/FetchProducts";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";
import GoogleDriveDownloader from "../../Modules/GoogleDriveDownloader";
import parse from 'html-react-parser';
import { Helmet } from "react-helmet";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product: products, loading } = useFetchProducts();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct);
    }
  }, [products, id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-purple-100 dark:bg-neutral-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!product && !loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-purple-100 dark:bg-neutral-950">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Product not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <Helmet>
        <title>{product.title} | Soft Game Studio</title>
        <meta name="description" content={product.description || "Explore our full project data."} />
        <meta name="keywords" content={`Project, ${product.title}, Soft Game Studio, Pre-built projects`} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageURL} />
      </Helmet>
      <div className="bg-purple-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-200 min-h-screen">
        {/* Parallax Hero Section */}
        <div className="relative h-screen overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-b from-purple-500/20 dark:from-neutral-900/80 to-transparent z-10"
          ></motion.div>
          
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          ></motion.div>
          
          <div className="relative z-20 flex flex-col justify-center items-center h-full text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg"
            >
              {product.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-purple-100 dark:text-cyan-100 max-w-3xl mb-6 sm:mb-8 drop-shadow-md"
            >
              {Array.isArray(product.category) ? product.category.join(", ") : product.category}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {product.price > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart({ ...product, quantity })}
                  className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart - ₹{product.price * quantity}
                </motion.button>
              ) : (
                <GoogleDriveDownloader location={product.location} />
              )}
              {product.videoUrl && (
                <Link to={product.videoUrl}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg border border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Preview
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <section className="relative z-30 py-12 sm:py-16 md:py-20 bg-purple-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
            >
              <div className="lg:w-1/2 w-full">
                <motion.img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-auto max-h-80 sm:max-h-96 object-contain rounded-xl shadow-2xl"
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
              <div className="lg:w-1/2 w-full">
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-purple-900 dark:text-white"
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Product Details
                </motion.h2>
                <motion.div 
                  className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 text-sm sm:text-base"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  
                  {parse(product.description)}
                </motion.div>
                
           
                

                <motion.div 
                  className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {product.price > 0 ? (
                    <button
                      onClick={() => addToCart({ ...product, quantity })}
                      className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Add to Cart - ₹{product.price * quantity}
                    </button>
                  ) : (
                    <GoogleDriveDownloader location={product.location} />
                  )}
                  {product.videoUrl && (
                    <Link to={product.videoUrl}>
                      <button className="bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-purple-600 dark:text-cyan-400 font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-md transition-all duration-300 border border-purple-200 dark:border-cyan-900 flex items-center gap-2 text-sm sm:text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Watch Preview
                      </button>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        {product.features && product.features.length > 0 && (
          <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-neutral-800">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-purple-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Product Features
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-purple-50 dark:bg-neutral-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-purple-600 dark:text-cyan-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-purple-900 dark:text-white mb-2">
                      Feature {index + 1}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specifications Section */}
        {product.specifications && (
          <section className="py-12 sm:py-16 md:py-20 bg-purple-50 dark:bg-neutral-900">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-purple-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Technical Specifications
              </motion.h2>
              <motion.div
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="hover:bg-purple-50 dark:hover:bg-neutral-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-neutral-900">
                          {key}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-800 dark:text-gray-300">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </section>
        )}

        {/* Parallax CTA Section */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-purple-200 dark:bg-neutral-800">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-purple-600/60 dark:bg-neutral-900/80"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Get This Product?
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-purple-100 dark:text-cyan-100 max-w-2xl mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Join thousands of satisfied customers who have already purchased our products.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {product.price > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart({ ...product, quantity })}
                  className="bg-white dark:bg-cyan-600 hover:bg-gray-100 dark:hover:bg-cyan-700 text-purple-600 dark:text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg transition-all duration-300"
                >
                  Buy Now - ₹{product.price * quantity}
                </motion.button>
              ) : (
                <GoogleDriveDownloader location={product.location} />
              )}
              <motion.button
                onClick={() => window.location.href = "/ContactUs"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent hover:bg-white/10 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base border-2 border-white transition-all duration-300"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}