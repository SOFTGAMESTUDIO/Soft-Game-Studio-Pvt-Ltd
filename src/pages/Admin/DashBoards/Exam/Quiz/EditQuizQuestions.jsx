import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import Layout from "../../../../../components/layout/Layout";

const initialQuestion = {
  question: "",
  code: "",
  options: { a: "", b: "", c: "", d: "" },
  correctAnswer: "a",
};

const EditQuizQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState(initialQuestion);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const quizRef = doc(fireDB, "quizzes", id);
      const quizSnap = await getDoc(quizRef);
      if (quizSnap.exists()) {
        setQuestions(quizSnap.data().questions || []);
      } else {
        toast.error("Quiz not found");
        navigate("/ADMIN-EXAM/");
      }
    };
    fetchQuestions();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["question", "correctAnswer"].includes(name)) {
      setQuestionForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setQuestionForm((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    }
  };

  const handleCodeChange = (value) => {
    setQuestionForm((prev) => ({ ...prev, code: value || "" }));
  };

  const handleAddOrUpdate = () => {
    const { question, options, correctAnswer } = questionForm;
    if (!question || !options.a || !options.b || !options.c || !options.d || !correctAnswer) {
      toast.error("Fill all fields correctly");
      return;
    }
    const updated = [...questions];
    if (editIndex === null) {
      updated.push(questionForm);
    } else {
      updated[editIndex] = questionForm;
    }
    setQuestions(updated);
    setQuestionForm(initialQuestion);
    setEditIndex(null);
    toast.success("Question saved");
  };

  const handleEdit = (index) => {
    setQuestionForm(questions[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure?")) {
      setQuestions(questions.filter((_, i) => i !== index));
      toast.success("Question deleted");
    }
  };

  const handleSaveToDB = async () => {
    try {
      await updateDoc(doc(fireDB, "quizzes", id), { questions });
      toast.success("Questions saved");
      navigate("/ADMIN-EXAM/");
    } catch (error) {
      toast.error("Save failed");
    }
  };

  return (
    <Layout>
  <div className="max-w-4xl mx-auto p-6 rounded-lg bg-purple-100 dark:bg-neutral-950 text-gray-800 dark:text-gray-100 transition-all">
      <h2 className="text-2xl font-bold mb-4">Edit Questions</h2>

      {/* Form Section */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          name="question"
          value={questionForm.question}
          onChange={handleChange}
          placeholder="Question"
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
        />

        <Editor
          height="200px"
          language="javascript"
          value={questionForm.code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />

        {["a", "b", "c", "d"].map((opt) => (
          <input
            key={opt}
            name={opt}
            value={questionForm.options[opt]}
            onChange={handleChange}
            placeholder={`Option ${opt.toUpperCase()}`}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
          />
        ))}

        <select
          name="correctAnswer"
          value={questionForm.correctAnswer}
          onChange={handleChange}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
        >
          {["a", "b", "c", "d"].map((opt) => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>

        <div className="space-x-2">
          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            {editIndex === null ? "Add" : "Update"} Question
          </button>
          <button
            onClick={handleSaveToDB}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Save All
          </button>
        </div>
      </div>

      {/* Display Questions Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Questions</h3>
        {questions.map((q, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded mb-4"
          >
            <p className="font-semibold mb-1 text-gray-800 dark:text-white">{q.question}</p>

            {q.code && (
              <pre className="bg-gray-900 p-2 text-sm overflow-auto text-green-400 mb-2 rounded">
                {q.code}
              </pre>
            )}

            <p className="text-sm text-gray-700 dark:text-gray-300">Options:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 mb-1">
              <li>A: {q.options.a}</li>
              <li>B: {q.options.b}</li>
              <li>C: {q.options.c}</li>
              <li>D: {q.options.d}</li>
            </ul>

            <p className="text-sm font-bold text-green-600 dark:text-green-400">
              Correct Answer: {q.correctAnswer.toUpperCase()}
            </p>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(i)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  
  );
};

export default EditQuizQuestions;
