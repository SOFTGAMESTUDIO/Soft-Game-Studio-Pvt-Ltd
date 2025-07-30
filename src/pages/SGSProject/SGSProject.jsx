import React, { useState, useEffect } from 'react';
import { fireDB } from '../../DataBase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../../components/layout/Layout';

export default function SGSProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, 'sgsProjects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects: ", err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderImagePreview = (url) => (
    <div className="relative h-48 overflow-hidden rounded-t-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      <img 
        src={url} 
        alt="Project preview" 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.parentElement.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-purple-500/10 to-indigo-500/20 flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm">Image unavailable</span>
            </div>
          `;
        }}
      />
    </div>
  );

  return (
    <Layout>
 <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          Our Projects
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore our innovative solutions and cutting-edge implementations that solve real-world challenges
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-neutral-700 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-neutral-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-4/6"></div>
                </div>
                <div className="flex mt-6 space-x-3">
                  <div className="h-10 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center">
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Loading Error</h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button 
            onClick={fetchProjects}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-red-200 dark:shadow-red-900/30"
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-12 text-center border border-purple-100 dark:border-neutral-700">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No Projects Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            We're currently working on new projects. Check back soon to see our latest innovations.
          </p>
          <button 
            onClick={fetchProjects}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
          >
            Refresh Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group"
            >
              {renderImagePreview(project.photoUrl)}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 min-h-[72px]">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {project.sourceCode && (
                    <a 
                      href={project.sourceCode} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 dark:bg-neutral-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors group/source"
                    >
                      <svg className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300 group-hover/source:text-black dark:group-hover/source:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-medium">Source</span>
                    </a>
                  )}
                  
                  {project.deployLink && (
                    <a 
                      href={project.deployLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white hover:opacity-90 transition-opacity group/demo"
                    >
                      <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      <span className="font-medium">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {projects.length} projects • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
    </Layout>
   
  );
}