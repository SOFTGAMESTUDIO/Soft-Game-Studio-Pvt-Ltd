import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import { toast } from "react-toastify";
import Layout from "../../../../../components/layout/Layout";

const EditQuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizDetails, setQuizDetails] = useState({
    name: "",
    language: "",
    imageUrl: "",
    description: "",
    examPage: "",
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizRef = doc(fireDB, "quizzes", id);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          const data = quizSnap.data();
          const examDate =
            data.examPage?.toDate?.() instanceof Date
              ? new Date(data.examPage.toDate()).toISOString().slice(0, 16)
              : data.examPage || "";

          setQuizDetails({
            name: data.name || "",
            language: data.language || "",
            imageUrl: data.imageUrl || "",
            description: data.description || "",
            examPage: examDate,
          });
        } else {
          toast.error("Quiz not found");
          navigate("/admin/manage");
        }
      } catch (err) {
        toast.error("Error fetching quiz");
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, language, imageUrl, description, examPage } = quizDetails;

    if (!name || !language || !imageUrl || !description || !examPage) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      await updateDoc(doc(fireDB, "quizzes", id), quizDetails);
      toast.success("Quiz details updated");
      navigate("/ADMIN-EXAM/");
    } catch (error) {
      toast.error("Failed to update quiz");
    }
  };

  return (
    <Layout>
 <div className="max-w-xl mx-auto p-6 mt-10 rounded-lg shadow-md bg-purple-100 dark:bg-neutral-950 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Edit Quiz Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quiz Name
          </label>
          <input
            type="text"
            name="name"
            value={quizDetails.name}
            onChange={handleChange}
            placeholder="Enter quiz name"
            className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <input
            type="text"
            name="language"
            value={quizDetails.language}
            onChange={handleChange}
            placeholder="Language"
            className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={quizDetails.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={quizDetails.description}
            onChange={handleChange}
            placeholder="Short description of the quiz"
            className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            rows={3}
          />
        </div>

        {/* Exam Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exam Date & Time
          </label>
          <input
            type="datetime-local"
            name="examPage"
            value={quizDetails.examPage}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/ADMIN-EXAM/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </Layout>
   
  );
};

export default EditQuizDetails;
