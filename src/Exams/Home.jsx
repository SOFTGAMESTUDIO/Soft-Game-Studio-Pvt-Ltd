// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { FaPlay, FaCode, FaTrophy, FaCrown, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { fireDB } from "../DataBase/firebaseConfig";
import Layout from '../components/layout/Layout';
import { useAuth } from '../AuthProvide';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Image slides for the carousel
  const slides = [
    { id: 1, title: "Weekly Quiz Challenge", description: "Test your knowledge every week!" },
    { id: 2, title: "Compete with Friends", description: "Challenge your friends and climb the leaderboard" },
    { id: 3, title: "Earn Achievements", description: "Unlock badges and show off your expertise" },
  ];

  const [freeQuizzes, setFreeQuizzes] = useState([]);
  const [officialQuizzes, setOfficialQuizzes] = useState([]);
  const [weeklyQuizzes, setWeeklyQuizzes] = useState([]);
  const [timers, setTimers] = useState({});
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  // Fetch free quizzes (top 4)
  useEffect(() => {
    const fetchFreeQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "quizzesfree"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setFreeQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching free quizzes:", error);
      } 
    };
    fetchFreeQuizzes();
  }, []);

  // Fetch official quizzes (top 4)
  useEffect(() => {
    const fetchOfficialQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "quizzes"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setOfficialQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching official quizzes:", error);
      } 
    };
    fetchOfficialQuizzes();
  }, []);

  // Fetch weekly quizzes (top 4)
  useEffect(() => {
    const fetchWeeklyQuizzes = async () => {
      try {
        const q = query(collection(fireDB, "Dailyquizzes"), limit(4));
        const querySnapshot = await getDocs(q);
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({ id: doc.id, ...doc.data() });
        });
        setWeeklyQuizzes(quizzesData);
      } catch (error) {
        console.error("Error fetching weekly quizzes:", error);
      } 
    };
    fetchWeeklyQuizzes();
  }, []);

  // Timer effect for quizzes
  useEffect(() => {
    const allQuizzes = [...freeQuizzes, ...officialQuizzes, ...weeklyQuizzes];
    const interval = setInterval(() => {
      const updatedTimers = {};
      allQuizzes.forEach((quiz) => {
        if (quiz.examPage) {
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
            if (days > 0) {
              updatedTimers[quiz.id] = `${days} days `;
            } else {   
              updatedTimers[quiz.id] = `${hours}H ${minutes}M ${seconds}S`; 
            }
          }
        }
      });
      setTimers(updatedTimers);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [freeQuizzes, officialQuizzes, weeklyQuizzes]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total quizzes and questions
        const freeSnapshot = await getDocs(collection(fireDB, "quizzesfree"));
        const officialSnapshot = await getDocs(collection(fireDB, "quizzes"));
        const weeklySnapshot = await getDocs(collection(fireDB, "Dailyquizzes"));
        
        const allQuizzes = [
          ...freeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...officialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          ...weeklySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        ];

        const quizCount = allQuizzes.length;
        const questionCount = allQuizzes.reduce((acc, quiz) => {
          return acc + (quiz.questions?.length || 0);
        }, 0);

        setTotalQuizzes(quizCount);
        setTotalQuestions(questionCount);

        // Fetch total users
        const userSnapshot = await getDocs(collection(fireDB, "users"));
        setTotalUser(userSnapshot.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleOpenQuiz = (quiz, type) => {
    if ((type === 'official' || type === 'weekly') && !user) {
      navigate('/login');
      return;
    }
    
    navigate(`/SGS-Quiz-${type}/${quiz.id}`);
  };

  const handleSeeAll = (type) => {
    if ((type === 'Official' || type === 'Weekly') && !user) {
      navigate('/login');
      return;
    }
    
    navigate(`/SGS-Quiz-${type}`);
  };

  const handleSeeResults = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate(`/${type}-Results`);
  };

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const QuizSection = ({ title, quizzes, type, icon }) => {
    const typeLower = type.toLowerCase();
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 dark:bg-neutral-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            {icon} <span className="ml-2">{title}</span>
          </h2>
          <div className="flex space-x-2">
            {(typeLower === 'official' || typeLower === 'weekly') && (
              <button 
                onClick={() => handleSeeResults(type)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-1 px-3 rounded-lg flex items-center"
              >
                <FaTrophy className="mr-1" /> Results
              </button>
            )}
            <button 
              onClick={() => handleSeeAll(type)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium py-1 px-3 rounded-lg border border-purple-600 hover:border-purple-800"
            >
              See All
            </button>
          </div>
        </div>
        
        {quizzes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No quizzes available</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="rounded-lg p-4 flex justify-between items-center border-l-4 border-purple-500 bg-gray-50 dark:bg-neutral-800 dark:border-purple-400"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white truncate">{quiz.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <FaCode className="mr-1 text-purple-500" /> 
                    <span>{quiz.language || 'General'}</span>
                    <span className="mx-2">•</span>
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                </div>
                
                {timers[quiz.id] === "STARTED" ? 
                  <button 
                    onClick={() => handleOpenQuiz(quiz, typeLower)} 
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors whitespace-nowrap ml-2"
                  >
                    Play
                  </button>
                  :
                  <button 
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm whitespace-nowrap ml-2"
                    disabled
                  >
                    {timers[quiz.id] || "Upcoming"}
                  </button>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen pb-16 transition-colors duration-300 bg-purple-50 text-gray-800 dark:bg-neutral-950 dark:text-white">
        {/* Hero Section */}
        <div className="relative text-white py-12 px-4 rounded-b-3xl shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 w-20 overflow-hidden rounded-full dark:bg-white/10">
                <img src="../assets/icon.png" className='w-20' alt="SGS Quiz" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">SGS QUIZ</h1>
            <p className="text-lg mb-6 opacity-90">Test your knowledge, challenge friends, and become a trivia master!</p>
           
            <button 
              onClick={() => {navigate('/DailyQuiz')}} 
              className="font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 bg-white text-purple-700 hover:bg-purple-100 dark:bg-purple-700 dark:text-white dark:hover:bg-purple-600"
            >
              <FaPlay className="inline-block mr-2" /> Play Weekly Quiz
            </button>
          </div>
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-yellow-300 animate-pulse"></div>
          <div className="absolute top-10 right-8 w-6 h-6 rounded-full bg-pink-300 opacity-70"></div>
          <div className="absolute bottom-8 left-10 w-5 h-5 rounded-full bg-white opacity-30 dark:bg-white dark:opacity-20"></div>
        </div>
        
        {/* Image Slider */}
        <div className="max-w-lg mx-auto mt-8 px-4 relative">
          <div className="relative h-56 overflow-hidden rounded-2xl shadow-xl">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-6 transition-opacity duration-500"
                style={{
                  background: index === 0 
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                    : index === 1 
                    ? 'linear-gradient(135deg, #6366F1, #7C3AED)' 
                    : 'linear-gradient(135deg, #EC4899, #7C3AED)',
                  opacity: currentSlide === index ? 1 : 0
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                <p className="text-white/90 text-center">{slide.description}</p>
              </div>
            ))}
          </div>
          
          {/* Slider Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="w-3 h-3 rounded-full bg-purple-300 dark:bg-purple-800 data-[active=true]:bg-purple-600 data-[active=true]:dark:bg-purple-500"
                data-active={currentSlide === index}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Quiz Sections */}
        <div className="mt-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">Our Quiz Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free Quizzes Section */}
            <QuizSection 
              title="Free Quizzes" 
              quizzes={freeQuizzes} 
              type="Free" 
              icon={<FaQuestionCircle className="text-blue-500" />}
            />
            
            {/* Official Quizzes Section */}
            {user ? (
              <QuizSection 
                title="Official Quizzes" 
                quizzes={officialQuizzes} 
                type="Official" 
                icon={<FaCrown className="text-amber-500" />}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
                  <FaCrown className="text-amber-500" /> <span className="ml-2">Official Quizzes</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Login to access premium official quizzes</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Login Now
                </button>
              </div>
            )}
            
            {/* Weekly Quizzes Section */}
            {user ? (
              <QuizSection 
                title="Weekly Quizzes" 
                quizzes={weeklyQuizzes} 
                type="Weekly" 
                icon={<FaTrophy className="text-purple-500" />}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
                  <FaTrophy className="text-purple-500" /> <span className="ml-2">Weekly Quizzes</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Login to participate in weekly challenges</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Login Now
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-12 rounded-3xl mx-4 p-6 shadow-inner bg-purple-100 dark:bg-neutral-900">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Quiz Community</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalUser}</div>
              <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                <FaUsers className="mr-1" /> Players
              </div>
            </div>
            
            <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalQuizzes}</div>
              <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                <FaCrown className="mr-1" /> Quizzes
              </div>
            </div>
            
            <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalQuestions}</div>
              <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                <FaQuestionCircle className="mr-1" /> Questions
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 text-center px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Ready to Challenge Yourself?</h2>
          <p className="mb-6 max-w-md mx-auto text-gray-600 dark:text-gray-300">
            Join millions of players worldwide in the ultimate trivia experience!
          </p>
          <button 
            onClick={() => navigate('/SGS-Quiz')}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Explore All Quizzes
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;