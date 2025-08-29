// src/pages/SGSQuizAppPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '../../components/layout/Layout';
import { fireDB } from '../../DataBase/firebaseConfig';
import { FaStar, FaStarHalfAlt, FaRegStar, FaDownload, FaEye, } from "react-icons/fa";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link } from 'react-router-dom';


const SGSQuizAppPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [status, setStatus] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  


  // Feature data
  const features = [
    {
      icon: "📅",
      title: "Weekly Exams",
      description: "Submit your answers before the week ends and track your progress through detailed analytics."
    },
    {
      icon: "🧠",
      title: "Free Knowledge Quiz",
      description: "Test your coding knowledge with our constantly updated quizzes covering various programming languages."
    },
    {
      icon: "🛡️",
      title: "Anti-Cheating System",
      description: "Our specially designed anti-cheating system ensures fair competition and accurate skill assessment."
    },
    {
      icon: "🏆",
      title: "Certificates",
      description: "Earn verifiable certificates upon completing exams to showcase your achievements."
    }
  ];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackRef = collection(fireDB, "feedback");
        const q = query(feedbackRef, orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);

        const feedbacks = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          feedbacks.push({
            id: doc.id,
            name: data.name,
            subject: data.subject,
            message: data.message,
            rating: data.rating,
            createdAt: data.createdAt?.toDate?.() || new Date()
          });
        });

        setFeedbackList(feedbacks);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setStatus("Failed to load feedback data");
      }
    };

    fetchFeedback();
  }, []);

  // Auto-rotate features on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-950 overflow-hidden">
        <Helmet>
          <html lang="en" />
          <title>Download SGS Quiz App - Soft Game Studio</title>
          <meta
            name="description"
            content="Download the official SGS Quiz App for free coding quizzes, weekly exams, and certificates. Enhance your programming knowledge with our anti-cheating system."
          />
          <meta
            property="og:title"
            content="Download SGS Quiz App - Soft Game Studio"
          />
          <meta
            property="og:description"
            content="Free quiz app for students to prepare coding knowledge with weekly exams, free quizzes, and certificates."
          />
          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/sgs-quiz-app.png?alt=media"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-3xl opacity-50 animate-pulse-slow"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-200 dark:bg-indigo-900/30 blur-3xl opacity-40 animate-pulse-slow delay-1000"></div>
        </div>

        {/* Main Content */}
        <section className="min-h-screen relative z-10 text-gray-900 dark:text-gray-200 px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-16">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                SGS Quiz App
              </motion.h1>

              <motion.p
                className="max-w-2xl mx-auto text-xl text-gray-700 dark:text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Free Quiz App for Students to Prepare Your Coding Knowledge
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                
                
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl max-w-md w-full">
                  <div className="bg-brand border-2 border-dashed rounded-xl w-full h-48 md:h-64 mx-auto mb-6 object-cover overflow-hidden">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/App%2Fsplash.png?alt=media&token=c839a793-40d5-4cab-b5e1-d2215493de83"
                      alt="SGS App Splash"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a
                    href="https://github.com/SOFTGAMESTUDIO/SGS-QUIZ-APP/releases/download/SGS-QUIZ-APP/sgs-official-v1.0.0.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <FaDownload />
                      Download Now
                    </motion.button>
                  </a>
                       <a
                    href="https://github.com/SOFTGAMESTUDIO/SGS-QUIZ-APP/releases/tag/SGS-QUIZ-APP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 px-6 mt-6 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <FaEye />
                      Explore App
                    </motion.button>
                  </a>

                  <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
                    Available on Android platforms | APK Size: 15MB
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
              className="mb-16 md:mb-24"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-center mb-12"
                variants={itemVariants}
              >
                App Features
              </motion.h2>

              {/* Desktop Features Grid */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-200 dark:border-neutral-700 h-full flex flex-col"
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 flex-grow">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Features Carousel */}
              <div className="md:hidden overflow-hidden relative h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-neutral-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-200 dark:border-neutral-700 h-full flex flex-col absolute inset-0"
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">{features[activeFeature].icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{features[activeFeature].title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {features[activeFeature].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                {/* Feature Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {features.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveFeature(idx)}
                      className={`w-3 h-3 rounded-full ${activeFeature === idx ? 'bg-purple-600' : 'bg-gray-300'}`}
                      aria-label={`Feature ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-4 md:p-8 mb-16 md:mb-24 text-white"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
              
              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {['Download', 'Register', 'Participate', 'Win'].map((step, index) => (
                  <div key={index} className="text-center flex flex-col items-center">
                    <div className="bg-white/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{index + 1}</span>
                    </div>
                    <h3 className="font-bold mb-2 text-lg">{step}</h3>
                    <p className="text-sm opacity-80">
                      {[
                        'Get the app for free',
                        'Create your account',
                        'Join quizzes and exams',
                        'Get certificates and recognition'
                      ][index]}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Download + Feedback */}
            <motion.div
              className="text-center mb-16 md:mb-24"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Download Now</h2>
              <p className="max-w-2xl mx-auto text-lg mb-10 text-gray-700 dark:text-gray-300">
                Join thousands of students improving their coding skills with our app
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a
                  href="https://github.com/SOFTGAMESTUDIO/SGS-QUIZ-APP/releases/tag/SGS-QUIZ-APP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 bg-black text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    <div className="text-3xl">🤖</div>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-xl font-bold">Github</div>
                    </div>
                  </motion.button>
                </a>
                
              </div>

              {/* Testimonials */}
              <div className="mt-16 bg-white dark:bg-neutral-800 rounded-2xl p-4 md:p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">What Students Say</h3>
                {feedbackList.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 py-8">{status || "No feedback available yet."}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedbackList.map((fb, index) => (
                      <motion.div
                        key={fb.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                      >
                        <div className="p-4 md:p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{fb.name}</h3>
                            </div>
                            <span className="text-xs text-gray-400">
                              {fb.createdAt.toLocaleDateString()}
                            </span>
                          </div>

                          <div className="mt-4">{renderStars(fb.rating)}</div>

                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-3">{fb.subject}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                            {fb.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <div className='flex flex-col items-center justify-center gap-6 mt-12'>
            <Link to={"/Feedback"}>
            <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 bg-black text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    <div>
                      <h1>Expolor More Feedbacks</h1>
                    </div>
                  </motion.button>
            </Link>
            

          </div>


        </section>
      </div>
    </Layout>
  );
};

export default SGSQuizAppPage;