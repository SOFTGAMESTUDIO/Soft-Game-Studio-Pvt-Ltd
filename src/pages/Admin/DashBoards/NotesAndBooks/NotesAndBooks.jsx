import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import Layout from '../../../../components/layout/Layout';

export default function NotesAndBooks() {
  const [activeTab, setActiveTab] = useState('notes');
  const [language, setLanguage] = useState('');
  const [resources, setResources] = useState({ notes: {}, books: {} });
  const [formData, setFormData] = useState({
    imageUrl: '',
    noteTitle: '',
    noteDescription: '',
    noteUrl: ''
  });

  // Fetch all resources
  useEffect(() => {
    const fetchResources = async () => {
      const docRef = doc(fireDB, 'resources', 'data');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setResources(docSnap.data());
      } else {
        // Initialize with empty structure if document doesn't exist
        await setDoc(docRef, {
          notes: {},
          books: {}
        });
      }
    };
    
    fetchResources();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLanguage = async () => {
    if (!language) return;
    
    const docRef = doc(fireDB, 'resources', 'data');
    
    await updateDoc(docRef, {
      [`${activeTab}.${language.toLowerCase()}`]: {
        imageUrl: '',
        name: language,
        notes: []
      }
    });
    
    // Refresh data
    const docSnap = await getDoc(docRef);
    setResources(docSnap.data());
    setLanguage('');
  };

  const addNote = async () => {
    if (!formData.noteTitle || !formData.noteUrl) return;
    
    const docRef = doc(fireDB, 'resources', 'data');
    const languageKey = language.toLowerCase();
    
    await updateDoc(docRef, {
      [`${activeTab}.${languageKey}.notes`]: arrayUnion({
        title: formData.noteTitle,
        description: formData.noteDescription,
        url: formData.noteUrl
      })
    });
    
    // Refresh data
    const docSnap = await getDoc(docRef);
    setResources(docSnap.data());
    setFormData({
      imageUrl: '',
      noteTitle: '',
      noteDescription: '',
      noteUrl: ''
    });
  };

  const updateImageUrl = async (newUrl) => {
    const docRef = doc(fireDB, 'resources', 'data');
    const languageKey = language.toLowerCase();
    
    await updateDoc(docRef, {
      [`${activeTab}.${languageKey}.imageUrl`]: newUrl
    });
    
    // Refresh data
    const docSnap = await getDoc(docRef);
    setResources(docSnap.data());
  };

  const deleteNote = async (noteIndex) => {
    const docRef = doc(fireDB, 'resources', 'data');
    const languageKey = language.toLowerCase();
    const currentNotes = resources[activeTab][languageKey]?.notes || [];
    
    // Remove the note at the specified index
    const updatedNotes = [...currentNotes];
    updatedNotes.splice(noteIndex, 1);
    
    await updateDoc(docRef, {
      [`${activeTab}.${languageKey}.notes`]: updatedNotes
    });
    
    // Refresh data
    const docSnap = await getDoc(docRef);
    setResources(docSnap.data());
  };

  return (
    <Layout>
    <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-200 mb-6">Resource Manager</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-purple-200 dark:border-neutral-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'notes' ? 'text-purple-700 dark:text-purple-300 border-b-2 border-purple-500' : 'text-purple-500 dark:text-purple-400'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'books' ? 'text-purple-700 dark:text-purple-300 border-b-2 border-purple-500' : 'text-purple-500 dark:text-purple-400'}`}
            onClick={() => setActiveTab('books')}
          >
            Books
          </button>
        </div>
        
        {/* Language Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
            {activeTab === 'notes' ? 'Notes' : 'Books'} Languages
          </h2>
          
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Enter language (e.g., PHP, JS)"
              className="flex-1 p-2 rounded border border-purple-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100"
            />
            <button
              onClick={addLanguage}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Language
            </button>
          </div>
          
          {/* Language List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(resources[activeTab] || {}).map((lang) => (
              <div 
                key={lang} 
                className={`p-3 rounded border cursor-pointer ${language.toLowerCase() === lang ? 'border-purple-500 bg-purple-50 dark:bg-neutral-700' : 'border-purple-200 dark:border-neutral-700'}`}
                onClick={() => setLanguage(resources[activeTab][lang].name)}
              >
                <div className="font-medium text-purple-800 dark:text-purple-200">
                  {resources[activeTab][lang].name}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {resources[activeTab][lang].notes?.length || 0} items
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected Language Content */}
        {language && resources[activeTab]?.[language.toLowerCase()] && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                {resources[activeTab][language.toLowerCase()].name} {activeTab === 'notes' ? 'Notes' : 'Books'}
              </h2>
              
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={resources[activeTab][language.toLowerCase()].imageUrl || ''}
                  onChange={(e) => updateImageUrl(e.target.value)}
                  placeholder="Image URL"
                  className="p-2 rounded border border-purple-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100"
                />
                {resources[activeTab][language.toLowerCase()].imageUrl && (
                  <img 
                    src={resources[activeTab][language.toLowerCase()].imageUrl} 
                    alt={language} 
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
              </div>
            </div>
            
            {/* Add Note Form */}
            <div className="bg-purple-50 dark:bg-neutral-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-3">Add New Note</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="noteTitle"
                    value={formData.noteTitle}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-purple-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">URL</label>
                  <input
                    type="url"
                    name="noteUrl"
                    value={formData.noteUrl}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-purple-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Description</label>
                <textarea
                  name="noteDescription"
                  value={formData.noteDescription}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-purple-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100"
                  rows="2"
                ></textarea>
              </div>
              
              <button
                onClick={addNote}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add Note
              </button>
            </div>
            
            {/* Notes List */}
            <div>
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-3">Existing Notes</h3>
              
              {resources[activeTab][language.toLowerCase()].notes?.length ? (
                <div className="space-y-3">
                  {resources[activeTab][language.toLowerCase()].notes.map((note, index) => (
                    <div key={index} className="border border-purple-200 dark:border-neutral-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-purple-800 dark:text-purple-200">{note.title}</h4>
                          {note.description && (
                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{note.description}</p>
                          )}
                          <a 
                            href={note.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-500 dark:text-purple-400 hover:underline inline-block mt-2"
                          >
                            View Note
                          </a>
                        </div>
                        <button
                          onClick={() => deleteNote(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-purple-700 dark:text-purple-300">No notes added yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
    
  );
}