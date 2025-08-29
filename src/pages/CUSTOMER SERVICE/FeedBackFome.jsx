import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import { fireDB} from "../../DataBase/firebaseConfig"; // Import Firebase configuration
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "", rating: 5
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Fetch feedback from Firestore
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const feedbackRef = collection(fireDB, "feedback");
        const q = query(feedbackRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const feedbacks = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          feedbacks.push({
            id: doc.id,
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            rating: data.rating,
            createdAt: data.createdAt.toDate()
          });
        });
        
        setFeedbackList(feedbacks);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setStatus("Failed to load feedback data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus("Submitting feedback...");
      
      // Add to Firestore
      const docRef = await addDoc(collection(fireDB, "feedback"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setStatus("Feedback submitted successfully!");
      
      // Update local state optimistically
      const newFeedback = {
        id: docRef.id,
        ...formData,
        createdAt: new Date()
      };
      
      setFeedbackList([newFeedback, ...feedbackList]);
      setFormData({ name: "", email: "", subject: "", message: "", rating: 5 });
    } catch (error) {
      console.error("Error adding feedback:", error);
      setStatus("Failed to submit feedback");
    }
    
    // Auto-clear success message
    setTimeout(() => setStatus(""), 3000);
  };

  // Calculate statistics
  const ratingStats = [1, 2, 3, 4, 5].map((r) => 
    feedbackList.filter((f) => Math.round(f.rating) === r).length
  );
  
  const total = feedbackList.length;
  const positiveFeedbacks = feedbackList.filter(f => f.rating >= 4).length;
  const positivePercentage = total > 0 ? Math.round((positiveFeedbacks / total) * 100) : 0;
  
  const avgRating = total > 0 
    ? (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1)
    : "0.0";

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => {
          const filled = rating >= i + 1;
          const half = rating > i && rating < i + 1;
          return filled ? (
            <FaStar key={i} className="text-yellow-400 text-lg" />
          ) : half ? (
            <FaStarHalfAlt key={i} className="text-yellow-400 text-lg" />
          ) : (
            <FaRegStar key={i} className="text-gray-400 text-lg" />
          );
        })}
      </div>
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto py-20 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gray-200 dark:bg-gray-700 h-12 w-64 mx-auto rounded animate-pulse"></h1>
              <p className="mt-4 h-6 w-80 bg-gray-200 dark:bg-gray-700 mx-auto rounded animate-pulse"></p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-32 mt-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-center h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></h2>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="max-w-2xl mx-auto mt-16 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></h2>
                <p className="mt-4 h-6 w-64 bg-gray-200 dark:bg-gray-700 mx-auto rounded animate-pulse"></p>
              </div>
              
              {[...Array(5)].map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
              
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://softgamestudios.web.app/Feedback" />
        <title>Customer Feedback Portal | Share Your Experience - Soft Game Studio</title>
        <meta name="description" content="Submit your feedback and read customer testimonials. See our 4.8/5 average rating from 50+ reviews. Help us improve your experience with our feedback form." />
        
        {/* Primary Meta Tags */}
        <meta name="keywords" content="customer feedback, user reviews, product rating, service feedback, testimonial submission, customer experience, feedback form" />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Share Your Feedback - Soft Game Studio Customer Portal" />
        <meta property="og:description" content="Join 50+ customers who've rated us 4.8/5. Submit your experience through our interactive feedback form with live rating statistics." />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FCustomer-Feedback-Portal-Share-Your-Experience-Soft-Game-Studio-06-07-2025_02_08_PM.png?alt=media&token=2f94c5c4-6d9c-482b-92df-015bef62c1ce" />
        <meta property="og:url" content="https://softgamestudios.web.app/Feedback" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@softgamestudio" />
        <meta name="twitter:title" content="Customer Feedback Portal | Soft Game Studio" />
        <meta name="twitter:description" content="See real-time rating statistics and submit your feedback. Our customers rate us 4.8/5 - add your experience!" />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FCustomer-Feedback-Portal-Share-Your-Experience-Soft-Game-Studio-06-07-2025_02_08_PM.png?alt=media&token=2f94c5c4-6d9c-482b-92df-015bef62c1ce" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Customer Feedback Portal",
            "description": "Interactive platform for submitting and viewing customer feedback",
            "publisher": {
              "@type": "Organization",
              "name": "Soft Game Studio",
              "logo": {
                "@type": "ImageObject",
                "url": "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
              }
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section with Parallax */}
        <div className="relative h-[80vh] overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center"
            style={{ y: y1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-90" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Share Your Experience
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-200 max-w-3xl mb-8"
            >
              Help us improve by sharing your feedback
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-yellow-400">{avgRating}</div>
                  <div>
                    <div className="flex gap-1">
                      {renderStars(avgRating)}
                    </div>
                    <p className="text-white mt-2">Based on {total} reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-b dark:text-white from-indigo-50 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{total}</div>
                <h3 className="text-xl font-semibold mt-2">Total Reviews</h3>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{positivePercentage}%</div>
                <h3 className="text-xl font-semibold mt-2">Positive Feedback</h3>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{avgRating}</div>
                <h3 className="text-xl font-semibold mt-2">Average Rating</h3>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Rating Chart */}
        <div className="py-16 bg-white dark:bg-gray-900 relative">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80')] bg-cover bg-center"
              style={{ y: y2 }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-3xl dark:text-white font-bold mb-6 text-center">Rating Distribution</h2>
              <div className="h-80">
                <Bar
                  data={{
                    labels: ["1★", "2★", "3★", "4★", "5★"],
                    datasets: [{
                      label: "Ratings",
                      data: ratingStats,
                      backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(249, 115, 22, 0.8)',
                        'rgba(234, 179, 8, 0.8)',
                        'rgba(101, 163, 13, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                      ],
                      borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(249, 115, 22)',
                        'rgb(234, 179, 8)',
                        'rgb(101, 163, 13)',
                        'rgb(16, 185, 129)',
                      ],
                      borderWidth: 1,
                      borderRadius: 8,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 14 },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y} reviews`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { 
                          stepSize: 1,
                          color: '#6B7280',
                          font: { size: 12 }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      x: {
                        ticks: { 
                          color: '#6B7280',
                          font: { size: 12, weight: 'bold' }
                        },
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  We're proud of our <span className="font-semibold">{avgRating}/5</span> average rating from {total} customers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feedback Form with Parallax */}
        <div className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900/10 relative">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 dark:opacity-5"
              style={{ y: y3 }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Share Your Feedback
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  We value your opinion and use it to improve our services
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Your Name
                    </label>
                    <input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Your Feedback
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    How would you rate us?
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= formData.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Submit Feedback
                </button>
                
                {status && (
                  <p className={`text-center py-3 rounded-lg ${status.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {status}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Customer Testimonials
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
                Hear what our users have to say about their experience
              </p>
            </div>
            
            {feedbackList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No feedback yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feedbackList.map((fb, index) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{fb.name}</h3>
                        </div>
                        <span className="text-xs text-gray-400">
                          {fb.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        {renderStars(fb.rating)}
                      </div>
                      
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-3">{fb.subject}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{fb.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}