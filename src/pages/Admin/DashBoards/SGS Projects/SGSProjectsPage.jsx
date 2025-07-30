import { useState, useEffect } from 'react';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import  Layout from '../../../../components/layout/Layout';

const SGSProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceCode: '',
    deployLink: '',
    photoUrl: '',
    photoPublicId: '',
    editingId: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(fireDB, 'sgsProjects'));
    const projectsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectsData);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Image Files',
            accept: {
              'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Only image files allowed (PNG, JPG, JPEG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be under 5MB');
        return;
      }

      setIsUploading(true);
      const storage = getStorage();
      const filePath = `sgs-projects/${Date.now()}_${file.name}`;
      const storageReference = storageRef(storage, filePath);
      const uploadTask = uploadBytesResumable(storageReference, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
          alert('Image upload failed.');
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            photoUrl: url,
            photoPublicId: filePath,
          }));
          setIsUploading(false);
        }
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Upload failed:', err);
        alert('Image selection canceled or failed');
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Project name and description are required');
      return;
    }
    if (!formData.photoUrl) {
      alert('Please upload a project image');
      return;
    }

    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      sourceCode: formData.sourceCode.trim(),
      deployLink: formData.deployLink.trim(),
      photoUrl: formData.photoUrl,
      photoPublicId: formData.photoPublicId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (formData.editingId) {
        await updateDoc(doc(fireDB, 'sgsProjects', formData.editingId), projectData);
      } else {
        await addDoc(collection(fireDB, 'sgsProjects'), projectData);
      }

      setFormData({
        name: '',
        description: '',
        sourceCode: '',
        deployLink: '',
        photoUrl: '',
        photoPublicId: '',
        editingId: null,
      });
      fetchProjects();
      alert(`Project ${formData.editingId ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      sourceCode: project.sourceCode || '',
      deployLink: project.deployLink || '',
      photoUrl: project.photoUrl,
      photoPublicId: project.photoPublicId,
      editingId: project.id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (projectId, publicId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      if (publicId) {
        const storage = getStorage();
        const imageRef = storageRef(storage, publicId);
        await deleteObject(imageRef).catch(e => console.warn('Image delete warning:', e));
      }
      await deleteDoc(doc(fireDB, 'sgsProjects', projectId));
      fetchProjects();
      alert('Project deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  // Render image preview (replaces missing renderCloudinaryImage)
  const renderImagePreview = (url, className = '') => (
    <img 
      src={url} 
      alt="Project preview" 
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.parentElement.innerHTML = '<div class="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">Image failed to load</div>';
      }}
    />
  );

  return (
    <Layout>
  <div className="min-h-screen p-4 md:p-8 bg-purple-100 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Project Form */}
        <form onSubmit={handleSubmit} className="mb-12 p-6 rounded-xl shadow-lg bg-white dark:bg-neutral-900 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">
            {formData.editingId ? 'Edit Project' : 'Add New Project'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Project Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={5}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your project..."
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Source Code Link</label>
                <input
                  type="url"
                  name="sourceCode"
                  value={formData.sourceCode}
                  onChange={(e) => setFormData({...formData, sourceCode: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Deployed Link</label>
                <input
                  type="url"
                  name="deployLink"
                  value={formData.deployLink}
                  onChange={(e) => setFormData({...formData, deployLink: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://your-project.com"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Project Image *</label>
                
                {!formData.photoUrl ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer mb-4 hover:border-purple-400 transition-colors"
                    onClick={handleImageUpload}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG, or WebP (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="mt-2 h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-100">
                      {renderImagePreview(formData.photoUrl)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                      {formData.photoPublicId.split('/').pop()}
                    </p>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className={`w-full py-3 px-4 ${
                    isUploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium rounded-lg transition-colors`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : formData.photoUrl ? (
                    'Change Image'
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {formData.editingId ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Update Project
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Save Project
                    </>
                  )}
                </button>
                
                {formData.editingId && (
                  <button
                    type="button"
                    onClick={() => setFormData({
                      name: '',
                      description: '',
                      sourceCode: '',
                      deployLink: '',
                      photoUrl: '',
                      photoPublicId: '',
                      editingId: null
                    })}
                    className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Projects List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">All Projects</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium">No projects yet</h3>
              <p className="mt-1">Add your first project to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-neutral-800"
                >
                  <div className="h-48 bg-gray-200 dark:bg-neutral-800 relative">
                    {renderImagePreview(project.photoUrl)}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 min-h-[60px]">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.sourceCode && (
                        <a 
                          href={project.sourceCode} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-neutral-800 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Source
                        </a>
                      )}
                      
                      {project.deployLink && (
                        <a 
                          href={project.deployLink} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.photoPublicId)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  
  );
};

export default SGSProjectsPage;