import React, { useState } from "react";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import Layout from "../../../../../components/layout/Layout";
import { useNavigate } from "react-router-dom";

const initialQuestion = {
  question: "",
  code: "",
  options: { a: "", b: "", c: "", d: "" },
  correctAnswer: "a",
};

const AdminCreateQuiz = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0);
  const [quizId, setQuizId] = useState(null);
  const [quizDetails, setQuizDetails] = useState({
    name: "",
    language: "",
    imageUrl: "",
    description: "",
    examPage: "",
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionForm, setQuestionForm] = useState(initialQuestion);
  const [isDarkTheme] = useState(true); // can be connected to app-wide theme context

  const handleQuizDetailsChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuizDetailsSubmit = async (e) => {
    e.preventDefault();
    const { name, language, imageUrl, description, examPage } = quizDetails;
    if (!name || !language || !imageUrl || !description || !examPage) {
      toast.error("Please fill all quiz details.");
      return;
    }
    try {
      const docRef = await addDoc(collection(fireDB, "quizzesfree"), {
        name,
        language,
        imageUrl,
        description,
        examPage,
        createdAt: new Date(),
      });
      setQuizId(docRef.id);
      setStep(1);
      toast.success("Quiz created. Now add questions.");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz.");
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    if (["question", "correctAnswer", "code"].includes(name)) {
      setQuestionForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setQuestionForm((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    }
  };

  const handleAddOrUpdateQuestion = () => {
    const { question, options, correctAnswer, code } = questionForm;
    if (
      !question.trim() ||
      !options.a.trim() ||
      !options.b.trim() ||
      !options.c.trim() ||
      !options.d.trim() ||
      !["a", "b", "c", "d"].includes(correctAnswer)
    ) {
      toast.error("Please fill all question fields correctly.");
      return;
    }
    if (currentQuestionIndex === null) {
      setQuestions((prev) => [...prev, { ...questionForm }]);
      toast.success("Question added.");
    } else {
      const updated = [...questions];
      updated[currentQuestionIndex] = { ...questionForm };
      setQuestions(updated);
      toast.success("Question updated.");
    }
    setQuestionForm(initialQuestion);
    setCurrentQuestionIndex(null);
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setQuestionForm(questions[index]);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
      setQuestionForm(initialQuestion);
      setCurrentQuestionIndex(null);
      toast.success("Question deleted.");
    }
  };

  const handleSaveQuestions = async () => {
    if (!quizId) {
      toast.error("Quiz not created yet.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Add at least one question.");
      return;
    }
    try {
      await updateDoc(doc(fireDB, "quizzesfree", quizId), { questions });
      toast.success("Questions saved successfully.");
      navigate("/ADMIN-QuizFree-Manage")
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error("Failed to save questions.");
    }
  };

  return (
    <Layout>
  <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-purple-100 dark:bg-neutral-950 text-gray-900 dark:text-white">
      {step === 0 && (
        <form onSubmit={handleQuizDetailsSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Create Quiz Exam</h2>
          {["name", "language", "imageUrl", "description", "examPage"].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                value={quizDetails[field]}
                onChange={handleQuizDetailsChange}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            Next: Add Questions
          </button>
        </form>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Questions</h2>
          <div className="space-y-3 mb-4 border p-4 rounded bg-white dark:bg-gray-800">
            <div>
              <label className="block font-semibold">Question</label>
              <input
                type="text"
                name="question"
                value={questionForm.question}
                onChange={handleQuestionChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold">Code (optional)</label>
              <Editor
                height="200px"
                language="javascript"
                value={questionForm.code}
                onChange={(value) => handleQuestionChange({ target: { name: "code", value: value || "" } })}
                theme={isDarkTheme ? "vs-dark" : "vs"}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["a", "b", "c", "d"].map((opt) => (
                <div key={opt}>
                  <label className="block font-semibold">Option {opt.toUpperCase()}</label>
                  <input
                    type="text"
                    name={opt}
                    value={questionForm.options[opt]}
                    onChange={handleQuestionChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block font-semibold">Correct Answer</label>
              <select
                name="correctAnswer"
                value={questionForm.correctAnswer}
                onChange={handleQuestionChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
              >
                {["a", "b", "c", "d"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddOrUpdateQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {currentQuestionIndex === null ? "Add Question" : "Update Question"}
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="border p-4 rounded bg-white dark:bg-gray-800">
                <p className="font-semibold">Q{index + 1}: {q.question}</p>
                {q.code && (
                  <pre className="text-sm text-green-800 dark:text-green-400 bg-green-100 dark:bg-gray-900 p-2 rounded mt-1 whitespace-pre-wrap">
                    {q.code}
                  </pre>
                )}
                <p className="text-sm mt-1">
                  A: {q.options.a} | B: {q.options.b} | C: {q.options.c} | D: {q.options.d} | Correct: {q.correctAnswer.toUpperCase()}
                </p>
                <button
                  onClick={() => handleEditQuestion(index)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveQuestions}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-6 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Save Questions
          </button>
        </div>
      )}
    </div>
    </Layout>
  
  );
};

export default AdminCreateQuiz;
