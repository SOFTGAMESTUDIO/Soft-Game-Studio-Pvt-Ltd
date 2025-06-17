import Layout from '../../../../components/layout/Layout';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaEdit, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { fireDB } from '../../../../DataBase/firebaseConfig';

 function DashBoardEbook() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const ebooksCollection = collection(fireDB, 'Ebooks');
        const snapshot = await getDocs(ebooksCollection);
        
        const ebooksList = [];
        snapshot.forEach(doc => {
          ebooksList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setEbooks(ebooksList);
      } catch (err) {
        console.error('Error fetching eBooks:', err);
        setError('Failed to load eBooks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEbooks();
  }, []);

  const handleDelete = async (ebookId) => {
    if (window.confirm('Are you sure you want to delete this eBook? This action cannot be undone.')) {
      try {
        // Add your delete logic here
        // await deleteDoc(doc(db, 'Ebooks/Notes', ebookId));
        setEbooks(ebooks.filter(ebook => ebook.id !== ebookId));
      } catch (err) {
        console.error('Error deleting eBook:', err);
        setError('Failed to delete eBook');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-purple-50 dark:bg-neutral-950">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }
  return (
    <Layout>
 
      <div className="max-w-6xl mx-auto p-4 bg-purple-50 dark:bg-neutral-950 min-h-screen">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Manage eBooks</h1>
          <Link 
            to="/Admin-EBookADD" 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New eBook
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {ebooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl">No eBooks found</p>
            <Link 
              to="/admin/ebooks/create" 
              className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg"
            >
              Create Your First eBook
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg overflow-hidden">
              <thead className="bg-purple-100 dark:bg-neutral-700">
                <tr>
                  <th className="py-3 px-4 text-left text-purple-800 dark:text-purple-300">Cover</th>
                  <th className="py-3 px-4 text-left text-purple-800 dark:text-purple-300">Title</th>
                  <th className="py-3 px-4 text-left text-purple-800 dark:text-purple-300">Chapters</th>
                  <th className="py-3 px-4 text-left text-purple-800 dark:text-purple-300">Created</th>
                  <th className="py-3 px-4 text-left text-purple-800 dark:text-purple-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {ebooks.map(ebook => (
                  <tr 
                    key={ebook.id} 
                    className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {ebook.coverImageURL ? (
                        <img 
                          src={ebook.coverImageURL} 
                          alt={ebook.title} 
                          className="w-16 h-20 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="bg-gray-200 dark:bg-neutral-700 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-md w-16 h-20 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-neutral-400 text-xs">No Cover</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{ebook.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2 max-w-md">
                        {ebook.description || 'No description'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ebook.chapterCount || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {ebook.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/Admin-EBookEdiet/${ebook.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(ebook.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          Delete
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
      
      <div className="mt-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">eBooks Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
            <div className="text-purple-800 dark:text-purple-300 font-bold text-2xl">
              {ebooks.length}
            </div>
            <div className="text-purple-700 dark:text-purple-400 mt-1">
              Total eBooks
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="text-blue-800 dark:text-blue-300 font-bold text-2xl">
              {ebooks.reduce((acc, ebook) => acc + (ebook.chapterCount || 0), 0)}
            </div>
            <div className="text-blue-700 dark:text-blue-400 mt-1">
              Total Chapters
            </div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="text-green-800 dark:text-green-300 font-bold text-2xl">
              {ebooks.length > 0 
                ? new Date(Math.max(...ebooks.map(e => e.createdAt?.seconds * 1000))).toLocaleDateString() 
                : 'N/A'}
            </div>
            <div className="text-green-700 dark:text-green-400 mt-1">
              Last Created
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
 
  );
};

export default DashBoardEbook;








 




