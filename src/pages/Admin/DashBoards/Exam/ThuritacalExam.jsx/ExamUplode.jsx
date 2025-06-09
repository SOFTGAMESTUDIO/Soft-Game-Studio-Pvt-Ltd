import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import Layout from "../../../../../components/layout/Layout";

const ExamUplode = () => {
    const [title, setExamTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setExamCategory] = useState("");
    const [price, setPrice] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [examLink, setExamLink] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [description, setDescription] = useState("");
    const [exams, setExams] = useState([]);
    const [editingExam, setEditingExam] = useState(null);
    
    useEffect(() => {
        const fetchExams = async () => {
            const examsSnapshot = await getDocs(collection(fireDB, "ExamConduct"));
            setExams(examsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchExams();
    }, []);

    const handleUpload = async () => {
        try {
            const newExam = { 
                title, 
                imageUrl, 
                category, 
                price, 
                videoUrl, 
                examLink, 
                dateTime,
                description, 
                timestamp: new Date() 
            };
            const docRef = await addDoc(collection(fireDB, "ExamConduct"), newExam);
            setExams([...exams, { id: docRef.id, ...newExam }]);
            resetForm();
            alert("Exam details added successfully!");
        } catch (error) {
            console.error("Error adding exam details:", error);
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setExamTitle(exam.title);
        setImageUrl(exam.imageUrl);
        setExamCategory(exam.category);
        setPrice(exam.price);
        setVideoUrl(exam.videoUrl || "");
        setExamLink(exam.examLink || "");
        setDateTime(exam.dateTime || "");
        setDescription(exam.description);
    };

    const handleUpdate = async () => {
        if (!editingExam) return;
        try {
            const examRef = doc(fireDB, "ExamConduct", editingExam.id);
            await updateDoc(examRef, { 
                title, 
                imageUrl, 
                category, 
                price, 
                videoUrl, 
                examLink, 
                dateTime,
                description 
            });
            setExams(exams.map(exam => exam.id === editingExam.id ? { 
                ...exam, 
                title, 
                imageUrl, 
                category, 
                price, 
                videoUrl, 
                examLink, 
                dateTime,
                description 
            } : exam));
            resetForm();
            alert("Exam details updated successfully!");
        } catch (error) {
            console.error("Error updating exam details:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(fireDB, "ExamConduct", id));
            setExams(exams.filter(exam => exam.id !== id));
            alert("Exam details deleted successfully!");
        } catch (error) {
            console.error("Error deleting exam details:", error);
        }
    };

    const resetForm = () => {
        setExamTitle("");
        setImageUrl("");
        setExamCategory("");
        setPrice("");
        setVideoUrl("");
        setExamLink("");
        setDateTime("");
        setDescription("");
        setEditingExam(null);
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
 <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col items-center p-6 transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg shadow-purple-200/50 dark:shadow-neutral-900/50"
            >
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Manage Exam Details
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Exam Title</label>
                        <input 
                            type="text" 
                            placeholder="Exam Title" 
                            value={title} 
                            onChange={(e) => setExamTitle(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input 
                            type="text" 
                            placeholder="Image URL" 
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Exam Category</label>
                        <input 
                            type="text" 
                            placeholder="Exam Category" 
                            value={category} 
                            onChange={(e) => setExamCategory(e.target.value.split(",").map((cat) => cat.trim()))} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input 
                            type="text" 
                            placeholder="Price" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Video URL</label>
                        <input 
                            type="text" 
                            placeholder="Video URL" 
                            value={videoUrl} 
                            onChange={(e) => setVideoUrl(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium mb-1">Exam Link</label>
                        <input 
                            type="text" 
                            placeholder="Exam Link" 
                            value={examLink} 
                            onChange={(e) => setExamLink(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            value={dateTime} 
                            onChange={(e) => setDateTime(e.target.value)} 
                            className="w-full p-3 mb-2 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                        />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                            placeholder="Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full p-3 bg-purple-50 dark:bg-neutral-700 rounded-lg border border-purple-200 dark:border-neutral-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                        ></textarea>
                    </motion.div>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={editingExam ? handleUpdate : handleUpload} 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white p-3 rounded-lg w-full mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    {editingExam ? "Update Exam" : "Add Exam"}
                </motion.button>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-3xl bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg shadow-purple-200/50 dark:shadow-neutral-900/50 mt-6"
            >
                <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Exam List
                </h2>
                
                <motion.div 
                    layout
                    className="space-y-4"
                >
                    {exams.map((exam) => (
                        <motion.div 
                            key={exam.id} 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="bg-purple-50 dark:bg-neutral-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h2 className="text-lg font-bold text-purple-800 dark:text-purple-300">{exam.title}</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{exam.category}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300">{exam.dateTime}</p>
                            
                            <div className="flex mt-4 gap-2">
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleEdit(exam)} 
                                    className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg flex-1 text-center transition-colors duration-300"
                                >
                                    Edit
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleDelete(exam.id)} 
                                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg flex-1 text-center transition-colors duration-300"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
        </Layout>
       
    );
};

export default ExamUplode;