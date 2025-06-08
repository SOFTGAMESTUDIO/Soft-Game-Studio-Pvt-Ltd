import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import Layout from "../../../components/layout/Layout";
import { fireDB } from "../../../DataBase/firebaseConfig";

const ExamList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "quizzes"));
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};
      quizzes.forEach((quiz) => {
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
    }, 1000); // Updated to check every second
  
    return () => clearInterval(interval);
  }, [quizzes]);
  

  const handleOpenQuiz = (quiz) => {
    window.location.href = `quiz/${quiz.id}`;
  };
  
  const handleDetailsQuiz = (quiz) => {
    window.location.href = `examinfo/${quiz.id}`;
  };
  

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading exams...</p>;
  }

  if (quizzes.length === 0) {
    return (<Layout><p className="text-center mt-10 text-white h-screen justify-center items-center flex">No exams found.</p></Layout> );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex justify-center">
                <img
                  src={quiz.imageUrl}
                  alt={quiz.name}
                  className="h-60 object-contain object-center mb-6 rounded-xl"
                />
              </div>
              <h2 className="flex flex-wrap tracking-widest text-xs title-font font-medium text-cyan-400 mb-2">
                <span className="m-1 flex flex-wrap">Quiz</span>
              </h2>
              <h1 className="text-lg font-semibold text-white mb-4">
                {quiz.name}
              </h1>
              <p className="text-xs text-gray-300 mb-4">
                Language: {quiz.language}
              </p>

              {/* Countdown or Start Button */}
              <div className="text-center mb-4 text-white text-sm">
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
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ExamList;
