import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import Layout from "../../../../../components/layout/Layout";

const quizCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { opacity: 0, x: -50 }
};

const buttonHover = {
  hover: { scale: 1.03 },
  tap: { scale: 0.98 }
};

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const quizCollection = collection(fireDB, "Dailyquizzes");
      const quizSnapshot = await getDocs(quizCollection);
      const quizList = quizSnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setQuizzes(quizList);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteDoc(doc(fireDB, "Dailyquizzes", id));
        toast.success("Quiz deleted successfully");
        setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
      } catch (error) {
        toast.error("Failed to delete quiz");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Manage Quizzes
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={() => navigate("/Admin-DailyQuiz-Create")}
            >
              Create New Quiz
            </motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center"
            >
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                No quizzes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first quiz to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
                onClick={() => navigate("/Admin-DailyQuiz-Create")}
              >
                Create New Quiz
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {quizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    variants={quizCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {quiz.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="mr-2">🌐</span>
                        <span>{quiz.language}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <motion.button
                          variants={buttonHover}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex-1 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium"
                          onClick={() => navigate(`/Admin-DailyQuiz-Edit-QuizDetails/${quiz.id}`)}
                        >
                          Edit Details
                        </motion.button>
                        <motion.button
                          variants={buttonHover}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex-1 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium"
                          onClick={() => navigate(`/Admin-DailyQuiz-Edit-QuizQuestion/${quiz.id}`)}
                        >
                          Edit Questions
                        </motion.button>
                      </div>
                       <div className="flex flex-wrap gap-2 mt-4">
                        <motion.button
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                        className="w-full mt-3 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        Delete Quiz
                      </motion.button>
                        <motion.button
                          variants={buttonHover}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex-1 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium"
                          onClick={() => navigate(`/Admin-DailyQuizQuiz-User-Answers`)}
                        >
                          User Answra
                        </motion.button>
                      </div>
                      
                     
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ManageQuizzes;