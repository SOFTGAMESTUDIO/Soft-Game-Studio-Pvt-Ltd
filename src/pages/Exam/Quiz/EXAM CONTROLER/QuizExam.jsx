import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Layout from "../../../../components/layout/Layout";
import Certificate from "../../../../components/Certificate/Certificate";
import { fireDB } from "../../../../DataBase/firebaseConfig";
import { getUserData } from "../../../../Modules/UserData";

const QuizExam = () => {
  const { id: quizId } = useParams();
  const [date, setDate] = useState("");
  const [step, setStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [filteredUser, setFilteredUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const userid = JSON.parse(localStorage.getItem("user"))?.email;
  const [score, setScore] = useState(0);
  const [Que, setQue] = useState(0);


    useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getUserData(); // Backend call
      setUserList(allUsers);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(userList) && userList.length > 0 && userid) {
      const matchedUser = userList.find(
  (user) => user.email?.toLowerCase() === userid?.toLowerCase());
      setFilteredUser(matchedUser);
    }
    
    setLoading(false);
  }, [userList, userid]);

  useEffect(() => setDate(new Date().toLocaleDateString()), []);

  useEffect(() => {
    const handlePopState = () => {
      if (step === 2 && !isAlreadySubmitted) handleSubmit();
    };
    const handleBeforeUnload = (e) => {
      if (step === 2 && !isAlreadySubmitted) {
        e.preventDefault();
        handleSubmit();
        e.returnValue = "";
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, isAlreadySubmitted]);

  

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyCutPaste = (e) => e.preventDefault();
    const blockPrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Screenshot is disabled.");
        alert("Screenshots are disabled.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    window.addEventListener("keyup", blockPrintScreen);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      window.removeEventListener("keyup", blockPrintScreen);
    };
  }, []);

  const handleDisqualification = async () => {
    if (!filteredUser?.uid || !quizData) return;
    try {
      await addDoc(collection(fireDB, "user_Quiz"), {
        quizId,
        uid: filteredUser.uid,
        email: filteredUser.email,
        name: filteredUser.name,
        rollNumber: filteredUser.rollNumber,
        language: quizData.language,
        timestamp: new Date(),
        disqualified: true,
        reason: "Cheating - switched tab",
      });
      toast.error("Disqualified for switching tabs.");
      window.location.href = "/";
    } catch (err) {
      console.error("Disqualification error:", err);
      toast.error("Failed to save disqualification.");
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden && step === 1 && !isAlreadySubmitted) {
      handleDisqualification();
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step, isAlreadySubmitted, filteredUser, quizData]);

  useEffect(() => {
    if (user && userid) {
      const matchedUser = user.find((obj) => obj.email === userid);
      if (matchedUser) setFilteredUser(matchedUser);
    }
  }, [user, userid]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        toast.error("Quiz ID missing.");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(fireDB, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setQuizData(docSnap.data());
        else toast.error("Quiz not found.");
      } catch (err) {
        console.error("Quiz fetch error:", err);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const checkSubmission = async () => {
      if (!filteredUser?.uid || !quizData) return;
      try {
        const q = query(
          collection(fireDB, "user_Quiz"),
          where("uid", "==", filteredUser.uid),
          where("quizId", "==", quizId)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsAlreadySubmitted(true);
          const docData = querySnapshot.docs[0].data();
          if (docData?.disqualified) {
            setIsDisqualified(true);
            console.warn("Disqualified:", docData?.reason);
          }
        }
      } catch (err) {
        console.error("Check submission error:", err);
      }
    };
    checkSubmission();
  }, [filteredUser, quizData, quizId]);

  const handleRadioChange = (index, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const fetchUserScore = async (uid, quizId) => {
    try {
      const q = query(
        collection(fireDB, "user_Quiz"),
        where("uid", "==", uid),
        where("quizId", "==", quizId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setScore(userDoc.score || 0);
        setQue(userDoc.NoQuestion || 0);
      }
    } catch (err) {
      console.error("Fetch score error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!filteredUser?.uid) {
      toast.error("User not authenticated.");
      return;
    }
    if (!quizData) {
      toast.error("Quiz not loaded.");
      return;
    }

    let correctCount = 0;
    quizData.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const NoQuestion = quizData.questions.length;

    try {
      await addDoc(collection(fireDB, "user_Quiz"), {
        quizId,
        language: quizData.language,
        uid: filteredUser.uid,
        email: filteredUser.email,
        name: filteredUser.name,
        rollNumber: filteredUser.rollNumber,
        timestamp: new Date(),
        score: correctCount,
        NoQuestion,
      });

      fetchUserScore(filteredUser.uid, quizId);
      toast.success("Quiz submitted!");
      setStep(2);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Submission failed.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-white mt-10">Loading quiz...</p>
      </Layout>
    );
  }

  if (!quizData) {
    return (
      <Layout>
        <p className="text-center mt-10 text-red-500">
          Quiz data not available.
        </p>
      </Layout>
    );
  }

  return (
    <>
      {step === 0 && (
        <Layout>
          <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <h1 className="text-3xl font-bold text-blue-500">
              {quizData.name} Quiz
            </h1>
            <p className="text-gray-400 text-sm">
              Welcome,{" "}
              <span className="font-medium">
                {filteredUser?.name || "Loading..."}
              </span>
            </p>
            {isAlreadySubmitted ? (
              isDisqualified ? (
                <div className="text-red-500 font-semibold text-center">
                  Disqualified. Reason: <em>Cheating - switched tab</em>
                </div>
              ) : (
                <>
                  <div className="bg-green-900/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg w-fit">
                    You have already completed this exam.
                  </div>
                  <div className="text-black">
                    <Certificate
                      name={filteredUser.name}
                      rollNumber={filteredUser.rollNumber}
                      examName={quizData.name}
                      date={date}
                      language={quizData.language}
                      score={score}
                      Que={Que}
                    />
                  </div>
                </>
              )
            ) : (
              <>
                <strong className="text-red-600 text-xl">Important Note</strong>
                <p className="text-white text-xl">
                  (Read Before Starting the Quiz)
                </p>
                <div
                  className="text-base text-gray-300 m-4"
                  dangerouslySetInnerHTML={{ __html: quizData.description }}
                />
                <button
                  onClick={() => setStep(1)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md"
                >
                  Start Quiz
                </button>
              </>
            )}
          </div>
        </Layout>
      )}

      {step === 1 && (
        <div className="space-y-6 m-5 p-5">
          <div className="bg-[#1e293b] p-5 rounded-xl shadow-inner">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              Q{currentQuestion + 1}.{" "}
              {quizData.questions[currentQuestion]?.question}
            </h2>
            {quizData.questions[currentQuestion]?.code && (
              <div className="mt-6 bg-gray-800 p-4 rounded-lg text-white">
                <h2 className="text-xl font-semibold mb-4">
                  Code for this Question:
                </h2>
                <pre className="whitespace-pre-wrap bg-gray-900 rounded-md p-4 font-mono text-sm overflow-x-auto">
                  {quizData.questions[currentQuestion].code}
                </pre>
              </div>
            )}

            <div className="space-y-3 min-h-[100px]">
              {quizData.questions[currentQuestion]?.options ? (
                Object.entries(
                  quizData.questions[currentQuestion].options
                ).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                      selectedAnswers[currentQuestion] === key
                        ? "bg-blue-600 border-blue-400 text-white"
                        : "bg-[#0f172a] border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={key}
                      checked={selectedAnswers[currentQuestion] === key}
                      onChange={() =>
                        handleRadioChange(currentQuestion, key)
                      }
                      className="accent-blue-600 w-6 h-6"
                    />
                    <span>{value}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  No options available for this question.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-700 text-gray-300 px-5 py-2 rounded-md disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
            >
              {currentQuestion === quizData.questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Layout>
          <div className="flex flex-col items-center space-y-6 text-center mt-10">
            <h1 className="text-3xl font-bold text-green-500">
              Congratulations!
            </h1>
            <p className="text-md text-gray-400">
              You have successfully completed the quiz.
            </p>
            <div className="text-black">
              <Certificate
                name={filteredUser.name}
                rollNumber={filteredUser.rollNumber}
                examName={quizData.name}
                date={date}
                language={quizData.language}
                score={score}
                Que={Que}
              />
            </div>
          </div>
        </Layout>
      )}

      {/* 🔧 New Feature: Add your new logic here */}

    </>
  );
};

export default QuizExam;
