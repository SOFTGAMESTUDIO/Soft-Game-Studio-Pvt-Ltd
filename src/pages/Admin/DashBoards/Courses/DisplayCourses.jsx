// src/pages/AllCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import Layout from '../../../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiSearch, FiFilter } from 'react-icons/fi';

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, 'courses'));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses: ', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search and filter criteria
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || course.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-neutral-950 dark:to-neutral-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-neutral-700 w-full"></div>
                    <div className="p-5">
                      <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
                      <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-neutral-950 dark:to-neutral-900 p-4 sm:p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header with Title and Add Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                Course Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage all your courses in one place
              </p>
            </div>
            
            <Link 
              to="/Admin-Courses-Add"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
            >
              <FiPlus className="text-xl" />
              <span className="font-semibold">Add New Course</span>
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <FiFilter className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Filter:</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      filter === 'all'
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    All Courses
                  </button>
                  <button
                    onClick={() => setFilter('single')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      filter === 'single'
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setFilter('playlist')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      filter === 'playlist'
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    Playlists
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.type === 'single' 
                          ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200'
                          : 'bg-purple-100 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200'
                      }`}>
                        {course.type === 'single' ? 'Single Course' : 'Playlist'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-1">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">
                      {course.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-neutral-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.type === 'playlist' 
                          ? `${course.chapters?.length || 0} chapters` 
                          : '1 lesson'}
                      </div>
                      
                      <Link 
                        to={`/Admin-Courses-Ediet/${course.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <FiEdit className="text-sm" />
                        <span>Edit Course</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-500 dark:text-gray-400 text-xl mb-4">
                  No courses found
                </div>
                <p className="text-gray-600 dark:text-gray-500 max-w-md mx-auto mb-6">
                  {searchTerm 
                    ? `No courses match your search for "${searchTerm}"` 
                    : 'No courses available. Try changing your filter settings.'}
                </p>
                <Link 
                  to="/Admin-Courses-Add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FiPlus />
                  Create Your First Course
                </Link>
              </div>
            )}
          </div>
          
          {/* Stats Footer */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap justify-between">
            <div className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredCourses.length}</span> of{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">{courses.length}</span> courses
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {courses.filter(c => c.type === 'single').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Single Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {courses.filter(c => c.type === 'playlist').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Playlists</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllCoursesPage;