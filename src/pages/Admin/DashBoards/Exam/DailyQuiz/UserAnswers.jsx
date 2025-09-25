import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { FaEdit, FaTrash, FaTrophy, FaFilter, FaExclamationTriangle } from "react-icons/fa";
import Layout from "../../../../../components/layout/Layout";
import { fireDB } from "../../../../../DataBase/firebaseConfig";

const UserAnswers = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [results, setResults] = useState([]);
  const [showResultForm, setShowResultForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [newResult, setNewResult] = useState({
    examName: "",
    language: "",
    winners: [],
    display: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState("");
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user answers based on quiz type
  const fetchUserAnswers = async () => {
    try {
      const collectionName = "user_DailyQuiz";
      const snapshot = await getDocs(collection(fireDB, collectionName));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserAnswers(data.filter(user => !user.disqualified));
      
      // Calculate statistics
      calculateStats(data.filter(user => !user.disqualified));
    } catch (error) {
      console.error("Error fetching user answers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics for each language
  const calculateStats = (data) => {
    const languageStats = {};
    
    // Initialize for all languages present
    data.forEach(user => {
      if (!languageStats[user.language]) {
        languageStats[user.language] = {
          count: 0,
          totalScore: 0,
          maxScore: 0,
          minScore: Infinity
        };
      }
      
      languageStats[user.language].count++;
      languageStats[user.language].totalScore += user.score || 0;
      
      if (user.score > languageStats[user.language].maxScore) {
        languageStats[user.language].maxScore = user.score;
      }
      
      if (user.score < languageStats[user.language].minScore) {
        languageStats[user.language].minScore = user.score;
      }
    });
    
    // Calculate averages
    Object.keys(languageStats).forEach(lang => {
      languageStats[lang].avgScore = languageStats[lang].totalScore / languageStats[lang].count;
      
      // If minScore is still Infinity (no valid scores), set to 0
      if (languageStats[lang].minScore === Infinity) {
        languageStats[lang].minScore = 0;
      }
    });
    
    setStats(languageStats);
  };

  // Fetch existing results based on quiz type
  const fetchResults = async () => {
    try {
      const collectionName = "Dailyresults" ;
      const snapshot = await getDocs(collection(fireDB, collectionName));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchUserAnswers();
    fetchResults();
  }, []);

  // Get top scorers with tie handling
  const getTopScorers = (language, count = 5) => {
    const languageUsers = userAnswers.filter(
      user => user.language === language && !user.disqualified
    );
    
    const sortedUsers = [...languageUsers].sort((a, b) => 
      (b.score || 0) - (a.score || 0)
    );
    
    if (sortedUsers.length <= count) return sortedUsers;
    
    const minScore = sortedUsers[count - 1].score;
    return sortedUsers.filter(user => user.score >= minScore);
  };

  // Auto-populate winners when language changes
  useEffect(() => {
    if (newResult.language && !editingResult) {
      const topScorers = getTopScorers(newResult.language);
      setNewResult(prev => ({
        ...prev,
        winners: topScorers.map(user => user.id)
      }));
    }
  }, [newResult.language, userAnswers]);

  // Handle result creation
  const handleCreateResult = async () => {
    try {
      const winnerDetails = newResult.winners.map(winnerId => {
        const user = userAnswers.find(ua => ua.id === winnerId);
        return {
          id: user.id,
          name: user.name,
          rollNumber: user.rollNumber,
          score: user.score
        };
      });

      const resultData = {
        ...newResult,
        winners: winnerDetails,
        createdAt: new Date()
      };

      const collectionName =  "Dailyresults" ;
      await addDoc(collection(fireDB, collectionName), resultData);
      fetchResults();
      setShowResultForm(false);
      setNewResult({
        examName: "",
        language: "",
        winners: [],
        display: false
      });
    } catch (error) {
      console.error("Error creating result:", error);
    }
  };

  // Handle result update
  const handleUpdateResult = async () => {
    try {
      const collectionName =  "Dailyresults";
      await updateDoc(doc(fireDB, collectionName, editingResult.id), {
        examName: newResult.examName,
        display: newResult.display
      });
      fetchResults();
      setShowResultForm(false);
      setEditingResult(null);
      setNewResult({
        examName: "",
        language: "",
        winners: [],
        display: false
      });
    } catch (error) {
      console.error("Error updating result:", error);
    }
  };

  // Delete result
  const handleDeleteResult = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        const collectionName =  "Dailyresults" ;
        await deleteDoc(doc(fireDB, collectionName, resultId));
        fetchResults();
      } catch (error) {
        console.error("Error deleting result:", error);
      }
    }
  };

  // Delete all records for a specific language
  const deleteAllRecordsForLanguage = async () => {
    if (!languageToDelete) return;
    
    try {
      setLoading(true);
      const collectionName = "user_DailyQuiz" ;
      
      // Query all documents with the specified language
      const q = query(
        collection(fireDB, collectionName), 
        where("language", "==", languageToDelete)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Delete each document
      const deletePromises = querySnapshot.docs.map((document) => 
        deleteDoc(doc(fireDB, collectionName, document.id))
      );
      
      await Promise.all(deletePromises);
      
      alert(`Successfully deleted all ${languageToDelete} records!`);
      fetchUserAnswers(); // Refresh the data
    } catch (error) {
      console.error("Error deleting language records:", error);
      alert("Error deleting records. Please check console for details.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setLanguageToDelete("");
    }
  };

  // Toggle result display
  const toggleResultDisplay = async (resultId, currentDisplay) => {
    try {
      const collectionName = "Dailyresults" ;
      await updateDoc(doc(fireDB, collectionName, resultId), {
        display: !currentDisplay
      });
      fetchResults();
    } catch (error) {
      console.error("Error updating display status:", error);
    }
  };

  // Start editing a result
  const startEditing = (result) => {
    setEditingResult(result);
    setNewResult({
      examName: result.examName,
      language: result.language,
      winners: result.winners.map(w => w.id),
      display: result.display
    });
    setShowResultForm(true);
  };

  // Get unique languages
  const getUniqueLanguages = () => {
    const languages = [...new Set(userAnswers.map(ua => ua.language))];
    return ["all", ...languages].filter(lang => lang);
  };

  // Filter data by language and search term
  const filteredUserAnswers = (selectedLanguage === "all" 
    ? userAnswers 
    : userAnswers.filter(ua => ua.language === selectedLanguage)
  ).filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = selectedLanguage === "all" 
    ? results 
    : results.filter(r => r.language === selectedLanguage);

  if (loading) {
    return (
      <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6">
        <p className="text-center mt-10 text-purple-800 dark:text-purple-200">
          Loading data...
        </p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                Competition Results Management
              </h1>
              <p className="text-purple-600 dark:text-purple-300">
                Automatically generate and manage competition results
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
              >
                <option value="all">All Languages</option>
                {getUniqueLanguages()
                  .filter(lang => lang !== "all")
                  .map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
              
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or roll no."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
                />
                <FaFilter className="absolute left-3 top-3 text-purple-400" />
              </div>
              
              <button
                onClick={() => {
                  setShowResultForm(true);
                  setEditingResult(null);
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <FaTrophy /> Create Result
              </button>
              
              {/* Delete Language Data Button */}
              {selectedLanguage !== "all" && (
                <button
                  onClick={() => {
                    setLanguageToDelete(selectedLanguage);
                    setShowDeleteConfirm(true);
                  }}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <FaTrash /> Clear {selectedLanguage} Data
                </button>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats).map(([language, data]) => (
              <div key={language} className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg text-purple-800 dark:text-purple-200">{language}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-sm text-purple-600 dark:text-purple-300">Participants:</div>
                  <div className="text-sm font-medium">{data.count}</div>
                  
                  <div className="text-sm text-purple-600 dark:text-purple-300">Avg Score:</div>
                  <div className="text-sm font-medium">{data.avgScore.toFixed(1)}</div>
                  
                  <div className="text-sm text-purple-600 dark:text-purple-300">Highest:</div>
                  <div className="text-sm font-medium">{data.maxScore}</div>
                  
                  <div className="text-sm text-purple-600 dark:text-purple-300">Lowest:</div>
                  <div className="text-sm font-medium">{data.minScore}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  <h3 className="text-lg font-bold text-red-600">Confirm Deletion</h3>
                </div>
                <p className="mb-4 text-purple-800 dark:text-purple-200">
                  Are you sure you want to delete ALL {languageToDelete} records? This action cannot be undone and will permanently remove all student data for this language.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAllRecordsForLanguage}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Delete All Records
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Result Creation/Edit Form */}
          {showResultForm && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                  {editingResult ? "Edit Result" : "Create New Result"}
                </h3>
                <button 
                  onClick={() => {
                    setShowResultForm(false);
                    setEditingResult(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-700 dark:text-purple-300 mb-1">
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    value={newResult.examName}
                    onChange={(e) => setNewResult({ ...newResult, examName: e.target.value })}
                    placeholder="Enter exam name"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-700 dark:text-purple-300 mb-1">
                    Language *
                  </label>
                  <select
                    value={newResult.language}
                    onChange={(e) => setNewResult({ ...newResult, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
                    disabled={editingResult}
                  >
                    <option value="">Select Language</option>
                    {getUniqueLanguages()
                      .filter(lang => lang !== "all")
                      .map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              
              {!editingResult && (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-700 dark:text-purple-300 mb-2">
                      Top Scorers (Automatically Selected)
                    </label>
                    <div className="bg-purple-50 dark:bg-neutral-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {newResult.winners.map((winnerId, index) => {
                          const winner = userAnswers.find(ua => ua.id === winnerId);
                          if (!winner) return null;
                          
                          return (
                            <div 
                              key={winnerId}
                              className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg border border-purple-200 dark:border-neutral-600"
                            >
                              <div>
                                <div className="font-medium text-purple-800 dark:text-purple-200">
                                  {index + 1}. {winner.name} ({winner.rollNumber})
                                </div>
                                <div className="text-sm text-purple-600 dark:text-purple-300">
                                  Score: {winner.score || 0}
                                </div>
                              </div>
                              <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                                Rank {index + 1}
                              </span>
                            </div>
                          );
                        })}
                        
                        {newResult.winners.length === 0 && (
                          <div className="text-center py-4 text-purple-700 dark:text-purple-300">
                            Select a language to see top scorers
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-purple-700 dark:text-purple-300 mb-2">
                      Note:
                    </label>
                    <p className="text-sm text-purple-600 dark:text-purple-300 bg-yellow-50 dark:bg-neutral-900 p-3 rounded-lg">
                      Winners are automatically selected based on highest scores. 
                      Tied scores are included in the results. You can only change 
                      the exam name and visibility after creation.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="displayResult"
                  checked={newResult.display}
                  onChange={(e) => setNewResult({ ...newResult, display: e.target.checked })}
                  className="mr-2 h-5 w-5 text-purple-600 rounded"
                />
                <label htmlFor="displayResult" className="text-purple-700 dark:text-purple-300">
                  Display this result to users
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowResultForm(false);
                    setEditingResult(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingResult ? handleUpdateResult : handleCreateResult}
                  disabled={!newResult.examName || !newResult.language || newResult.winners.length === 0}
                  className={`px-4 py-2 rounded-lg ${
                    !newResult.examName || !newResult.language || newResult.winners.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  } text-white transition-all`}
                >
                  {editingResult ? "Update Result" : "Create Result"}
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 mb-6">
            <div className="p-6 border-b border-purple-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                Published Results ({"Weekly"})
              </h2>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                Manage visibility of competition results
              </p>
            </div>

            {filteredResults.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-purple-800 dark:text-purple-200">
                  No results found for selected language
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200 dark:divide-neutral-700">
                  <thead className="bg-purple-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Exam Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Winners
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-purple-100 dark:divide-neutral-700">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200 font-medium">
                          {result.examName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                          {result.language}
                        </td>
                        <td className="px-6 py-4 text-sm text-purple-800 dark:text-purple-200">
                          <ul className="list-disc pl-5">
                            {result.winners.slice(0, 3).map((winner, index) => (
                              <li key={winner.id}>
                                {index + 1}. {winner.name} ({winner.rollNumber}) - {winner.score}
                              </li>
                            ))}
                            {result.winners.length > 3 && (
                              <li className="text-purple-600 dark:text-purple-300">
                                +{result.winners.length - 3} more winners
                              </li>
                            )}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.display 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}>
                            {result.display ? "Published" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleResultDisplay(result.id, result.display)}
                              className={`p-2 rounded ${
                                result.display
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-500 hover:bg-green-600"
                              } text-white`}
                              title={result.display ? "Hide from users" : "Publish to users"}
                            >
                              {result.display ? "Hide" : "Publish"}
                            </button>
                            <button
                              onClick={() => startEditing(result)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Submissions Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-purple-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                User Submissions ({"Weekly"})
              </h2>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                {filteredUserAnswers.length} valid submissions found
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {filteredUserAnswers.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-purple-800 dark:text-purple-200">
                  No submissions found for selected language
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200 dark:divide-neutral-700">
                  <thead className="bg-purple-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-purple-100 dark:divide-neutral-700">
                    {filteredUserAnswers
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((ua, index) => {
                        const sameScoreUsers = filteredUserAnswers.filter(
                          user => user.score === ua.score
                        );
                        
                        const minRank = sameScoreUsers.reduce((min, user) => {
                          const userIndex = filteredUserAnswers.findIndex(u => u.id === user.id);
                          return userIndex < min ? userIndex : min;
                        }, index) + 1;
                        
                        return (
                          <tr key={ua.id} className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900 dark:text-purple-100">
                              {minRank}
                              {sameScoreUsers.length > 1 && (
                                <span className="text-xs text-purple-500 ml-1">
                                  (tied)
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.rollNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.language}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200 font-bold">
                              {ua.score || 0}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAnswers;