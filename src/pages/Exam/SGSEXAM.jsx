import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import { useCart } from "../../Modules/Cart/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SGSEXAM = () => {
  const [activeTab, setActiveTab] = useState("quizExam");
  const [theoryExams, setTheoryExams] = useState([]);
  const [quizExams, setQuizExams] = useState([]);
  const [theoryResults, setTheoryResults] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [timers, setTimers] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch theory exams
        const theorySnapshot = await getDocs(collection(fireDB, "ExamConduct"));
        const theoryData = theorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTheoryExams(theoryData);

        // Fetch quiz exams
        const quizSnapshot = await getDocs(collection(fireDB, "quizzes"));
        const quizData = quizSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizExams(quizData);

        // Initialize timers for quiz exams
        const initialTimers = {};
        quizData.forEach((quiz) => {
          const examTime = new Date(quiz.examPage).getTime();
          const now = new Date().getTime();
          const timeLeft = examTime - now;

          if (timeLeft <= 0) {
            initialTimers[quiz.id] = "STARTED";
          } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            initialTimers[quiz.id] = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
          }
        });
        setTimers(initialTimers);

        // TODO: Fetch results data when available
        // setTheoryResults(theoryResultsData);
        // setQuizResults(quizResultsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      quizExams.forEach((quiz) => {
        const examTime = new Date(quiz.examPage).getTime();
        const now = new Date().getTime();
        const timeLeft = examTime - now;

        if (timeLeft <= 0) {
          updatedTimers[quiz.id] = "STARTED";
        } else {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          updatedTimers[quiz.id] = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
        }
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizExams]);

  const handleOpenQuiz = (quiz) => {
    window.location.href = `/SGS-Quiz/${quiz.id}`;
  };

  const handleDetailsQuiz = (quiz) => {
    window.location.href = `/Exam-Quiz-Details/${quiz.id}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "theoryExam":
        return (
          <div className="py-8">
            {theoryExams.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {theoryExams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={exam.imageUrl}
                        alt={exam.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-purple-600 dark:bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {exam.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {exam.title}
                      </h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-purple-600 dark:text-cyan-400">
                          ₹{exam.price}
                        </span>
                      </div>
                      <div className="mt-6 space-y-3">
                        <Link
                          to={`/Exam-Details/${exam.id}`}
                          className="block w-full text-center bg-purple-100 dark:bg-neutral-700 hover:bg-purple-200 dark:hover:bg-neutral-600 text-purple-600 dark:text-cyan-400 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          View Details
                        </Link>
                        {exam.price > 0 ? (
                          <button
                            onClick={() => addToCart(exam)}
                            className="w-full bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Register Exam (₹{exam.price})
                          </button>
                        ) : (
                          <a
                            href={exam.examLink || "#"}
                            className="block w-full text-center bg-purple-600 dark:bg-cyan-600 hover:bg-purple-700 dark:hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 md:flex items-center justify-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Enroll Now
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center justify-center h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl text-gray-900 dark:text-white">
                  No Theory Exams Available
                </h2>
              </motion.div>
            )}
          </div>
        );
      
      case "quizExam":
        return (
         <div className="py-8">
  {quizExams.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {quizExams.map((quiz) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-100 dark:bg-neutral-950 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-neutral-800"
        >
          <div className="flex justify-center">
            <img
              src={quiz.imageUrl}
              alt={quiz.name}
              className="h-60 object-contain object-center mb-6 rounded-xl"
            />
          </div>
          <h2 className="flex flex-wrap tracking-widest text-xs title-font font-medium text-purple-600 dark:text-cyan-400 mb-2">
            <span className="m-1 flex flex-wrap">Quiz</span>
          </h2>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {quiz.name}
          </h1>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">
            Language: {quiz.language}
          </p>

          <div className="text-center mb-4">
            {timers[quiz.id] === "STARTED" ? (
              <button
                onClick={() => handleOpenQuiz(quiz)}
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Start Quiz
              </button>
            ) : (
              <button
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {timers[quiz.id] || "Loading timer..."}
              </button>
            )}
          </div>

          <div className="items-center flex justify-center flex-wrap">
            <button
              onClick={() => handleDetailsQuiz(quiz)}
              type="button"
              className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <motion.div 
      className="flex items-center justify-center h-96 bg-purple-50 dark:bg-neutral-900 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl text-gray-900 dark:text-white">
        No Quiz Exams Available
      </h2>
    </motion.div>
  )}
</div>
        );
      
      case "theoryResult":
        return (
          <div className="py-8">
            {theoryResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {theoryResults.map((result) => (
                  <div key={result.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{result.examTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Score: {result.score}</p>
                    <p className="text-gray-600 dark:text-gray-300">Rank: {result.rank}</p>
                    <p className="text-gray-600 dark:text-gray-300">Date: {result.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <h2 className="text-2xl text-gray-900 dark:text-white">
                  No Theory Results Available
                </h2>
              </div>
            )}
          </div>
        );
      
      case "quizResult":
        return (
          <div className="py-8">
            {quizResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {quizResults.map((result) => (
                  <div key={result.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{result.quizName}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Score: {result.score}</p>
                    <p className="text-gray-600 dark:text-gray-300">Correct Answers: {result.correctAnswers}</p>
                    <p className="text-gray-600 dark:text-gray-300">Date: {result.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <h2 className="text-2xl text-gray-900 dark:text-white">
                  No Quiz Results Available
                </h2>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="bg-purple-100 dark:bg-neutral-950 text-gray-900 dark:text-gray-200 min-h-screen">
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
                Exam Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-6 max-w-3xl mx-auto text-xl text-purple-100 dark:text-cyan-100"
              >
                Access all your exams and results in one place
              </motion.p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={() => setActiveTab("quizExam")}
              className={`mr-2 py-4 px-6 font-medium text-sm rounded-t-lg ${activeTab === "quizExam" ? "bg-purple-600 dark:bg-cyan-600 text-white" : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"}`}
            >
              Quiz Exams
            </button>
            <button
              onClick={() => setActiveTab("theoryExam")}
              className={`mr-2 py-4 px-6 font-medium text-sm rounded-t-lg ${activeTab === "theoryExam" ? "bg-purple-600 dark:bg-cyan-600 text-white" : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"}`}
            >
              Theory Exams
            </button>
            <button
              onClick={() => setActiveTab("quizResult")}
              className={`mr-2 py-4 px-6 font-medium text-sm rounded-t-lg ${activeTab === "quizResult" ? "bg-purple-600 dark:bg-cyan-600 text-white" : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"}`}
            >
              Quiz Results
            </button>
            <button
              onClick={() => setActiveTab("theoryResult")}
              className={`py-4 px-6 font-medium text-sm rounded-t-lg ${activeTab === "theoryResult" ? "bg-purple-600 dark:bg-cyan-600 text-white" : "bg-purple-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-neutral-700"}`}
            >
              Theory Results
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="bg-purple-600 dark:bg-neutral-900 py-16">
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Need help with your exams?
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-100 dark:text-cyan-100 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Contact our support team for any questions about exams or results.
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
};

export default SGSEXAM;