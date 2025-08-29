import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { fireDB } from "../../../../DataBase/firebaseConfig";
import Layout from "../../../../components/layout/Layout";
import { Helmet } from "react-helmet";

const ExamQuizDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const docRef = doc(fireDB, "quizzes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const examData = docSnap.data();
          setExam({
            ...examData,
            id: docSnap.id
          });
        } else {
          setExam(null);
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (!exam?.examPage) return;

    const interval = setInterval(() => {
      const examTime = new Date(exam.examPage).getTime();
      const now = new Date().getTime();
      const diff = examTime - now;

      if (diff <= 0) {
        setTimeLeft("STARTED");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const handleOpenQuiz = (examId) => {
    navigate(`/quiz/${examId}`);
  };

  if (loading) {
    return (
      <Layout>
          <Helmet>
        <title> Quiz Exam | Soft Game Studio</title>
        <meta name="description" content='Test your skills with our quiz.' />
        <meta name="keywords" content={`Quiz, Soft Game Studio`} />
        <meta property="og:title" content={` Quiz Exam`} />
      </Helmet>
        <div className="flex justify-center items-center h-screen bg-purple-100 dark:bg-neutral-950">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-purple-500 dark:border-cyan-500 border-t-transparent rounded-full"
          ></motion.div>
        </div>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <Helmet>
        <title>{exam.name} | Quiz Exam | Soft Game Studio</title>
        <meta name="description" content={exam.description || 'Test your skills with our quiz.'} />
        <meta name="keywords" content={`Quiz, ${exam.level}, ${exam.title}, Soft Game Studio`} />
        <meta property="og:title" content={`${exam.name} | Quiz Exam`} />
        <meta property="og:description" content={exam.description} />
        <meta property="og:url" content={`https://softgamestudios.web.app/exam/quiz/${id}`} />
        <meta property="og:image" content={exam.imageUrl} />
      </Helmet>
        <div className="flex flex-col items-center justify-center h-screen bg-purple-100 dark:bg-neutral-950 text-center p-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl mb-4 text-purple-600 dark:text-cyan-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-purple-900 dark:text-white mb-2"
          >
            Exam Not Found
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-700 dark:text-gray-300 mb-6 max-w-md"
          >
            The exam you're looking for doesn't exist or may have been removed.
          </motion.p>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
          >
            Go Back
          </motion.button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
       <Helmet>
        <title>{exam.name} | Quiz Exam | Soft Game Studio</title>
        <meta name="description" content={exam.description || 'Test your skills with our quiz.'} />
        <meta name="keywords" content={`Quiz, ${exam.level}, ${exam.title}, Soft Game Studio`} />
        <meta property="og:title" content={`${exam.name} | Quiz Exam`} />
        <meta property="og:description" content={exam.description} />
        <meta property="og:url" content={`https://softgamestudios.web.app/exam/quiz/${id}`} />
        <meta property="og:image" content={exam.imageUrl} />
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
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{ 
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></motion.div>
          
          <div className="relative z-20 flex flex-col justify-center items-center h-full text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg"
            >
              {exam.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-purple-100 dark:text-cyan-100 max-w-3xl mb-6 sm:mb-8 drop-shadow-md"
            >
              {exam.language} Exam
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {timeLeft === "STARTED" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenQuiz(exam.id)}
                  className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Start Exam Now
                </motion.button>
              ) : (
                <motion.button
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {timeLeft || "Loading timer..."}
                </motion.button>
              )}
              <motion.button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg border border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Exam Details
              </motion.button>
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
                  src={exam.imageUrl}
                  alt={exam.name}
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
                  Exam Details
                </motion.h2>
                <motion.div 
                  className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 text-sm sm:text-base"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {parse(exam.description)}
                </motion.div>
                <motion.div 
                  className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {timeLeft === "STARTED" ? (
                    <button
                      onClick={() => handleOpenQuiz(exam.id)}
                      className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                      Start Exam Now
                    </button>
                  ) : (
                    <button
                      className="bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {timeLeft || "Loading timer..."}
                    </button>
                  )}
                  <button 
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                    className="bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-purple-600 dark:text-cyan-400 font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg shadow-md transition-all duration-300 border border-purple-200 dark:border-cyan-900 flex items-center gap-2 text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Need Help?
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-purple-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Exam Guidelines
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Time Management",
                  description: "The exam has a strict time limit. Manage your time wisely across all questions."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: "No Cheating",
                  description: "Any form of cheating will result in immediate disqualification."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: "Strict Deadline",
                  description: "Once the exam starts, you must complete it within the given timeframe."
                }
              ].map((feature, index) => (
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
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax CTA Section */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-purple-200 dark:bg-neutral-800">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"
            style={{ 
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
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
              Ready to Take the Exam?
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-purple-100 dark:text-cyan-100 max-w-2xl mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Make sure you're prepared before starting the exam.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {timeLeft === "STARTED" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenQuiz(exam.id)}
                  className="bg-white dark:bg-cyan-600 hover:bg-gray-100 dark:hover:bg-cyan-700 text-purple-600 dark:text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg transition-all duration-300"
                >
                  Start Exam Now
                </motion.button>
              ) : (
                <motion.button
                  className="bg-white dark:bg-cyan-600 hover:bg-gray-100 dark:hover:bg-cyan-700 text-purple-600 dark:text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg transition-all duration-300"
                >
                  {timeLeft || "Exam starts in..."}
                </motion.button>
              )}
              <motion.button
                onClick={() => window.location.href = "/ContactUs"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent hover:bg-white/10 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base border-2 border-white transition-all duration-300"
              >
                Contact Support
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExamQuizDetails;