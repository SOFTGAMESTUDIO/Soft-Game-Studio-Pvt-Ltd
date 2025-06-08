import React, { useState, useEffect } from "react";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Layout from "../../../../../components/layout/Layout";

const UserAnswers = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAnswers = async () => {
    try {
      const snapshot = await getDocs(collection(fireDB, "user_Quiz"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserAnswers(data);
    } catch (error) {
      console.error("Error fetching user answers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAnswers();
  }, []);

  if (loading) {
    return (
      <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6">
        <p className="text-center mt-10 text-purple-800 dark:text-purple-200">
          Loading user submissions...
        </p>
      </div>
    );
  }

  if (userAnswers.length === 0) {
    return (
      <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6">
        <p className="text-center mt-10 text-purple-800 dark:text-purple-200">
          No user submissions found.
        </p>
      </div>
    );
  }

  return (
    <Layout>
  <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-purple-200 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">
              User Quiz Submissions
            </h2>
            <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
              Overview of all user quiz attempts and results
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200 dark:divide-neutral-700">
              <thead className="bg-purple-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    Email
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-purple-100 dark:divide-neutral-700">
                {userAnswers.map((ua, index) => (
                  <tr
                    key={ua.id}
                    className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900 dark:text-purple-100">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.language}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.score || 0}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        ua.disqualified
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {ua.disqualified
                        ? `Disqualified (${ua.reason})`
                        : "Valid"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                      {ua.timestamp
                        ? new Date(ua.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  
  );
};

export default UserAnswers;