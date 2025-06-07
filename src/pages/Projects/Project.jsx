
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useFetchProducts from "../../Modules/FetchProducts";
import GoogleDriveDownloader from "../../Modules/GoogleDriveDownloader";
import { useCart } from "../../Modules/Cart/CartContext";
import { CardBody, CardContainer, CardItem } from "../../UiComponents/3dCard";
import Layout from "../../components/layout/Layout";

export default function ProductsPage() {
  const { product, loading } = useFetchProducts();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!product) return;
    let filtered = product.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        item.category?.includes("Projects")
    );

    if (filterType === "paid") {
      filtered = filtered.filter((item) => parseInt(item.price) > 0);
    } else if (filterType === "free") {
      filtered = filtered.filter((item) => parseInt(item.price) === 0);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filterType, product]);

  return (
    <Layout>
 <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white px-4 py-12 md:px-16 md:py-16">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Projects
      </motion.h1>

      <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 text-black dark:text-white transition-colors"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900 text-black dark:text-white transition-colors"
        >
          <option value="all">All Projects</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center">No projects found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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
  whileHover={{ scale: 1.03 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <CardContainer className="inter-var">
    <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
      w-full max-w-sm h-[420px] rounded-xl p-6 border flex flex-col justify-between"
    >
      <div>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white truncate whitespace-normal break-words"
          title={title}
        >
          {title}
        </CardItem>

        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-full mt-2 dark:text-neutral-300 line-clamp-3 whitespace-normal break-words"
        >
          {(Array.isArray(category) ? category : [category]).join(", ")}
        </CardItem>

       
      </div>

       <div>
         <CardItem translateZ="100" className="w-full mt-4 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            height={1000}
            width={1000}
            className="h-40 w-full object-cover rounded-lg group-hover/card:shadow-xl transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
        {price > 0 ? (
          <>
            <CardItem
              translateZ={20}
              as="button"
              onClick={() => addToCart({ id, title, price, imageUrl, category })}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition"
            >
              ₹{price} Add to Cart
            </CardItem>

            <CardItem
              translateZ={20}
              as="a"
              href={`/productinfo/${id}`}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 text-xs font-semibold dark:text-white text-black hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              Details
            </CardItem>
          </>
        ) : (
          <CardItem translateZ={20} className="text-xs dark:text-neutral-300">
            <GoogleDriveDownloader location={location} />
          </CardItem>
        )}
      </div>
       </div>
      
    </CardBody>
  </CardContainer>
</motion.div>

          ))}
        </motion.div>
      )}
    </div>
    </Layout>
   
  );
}
