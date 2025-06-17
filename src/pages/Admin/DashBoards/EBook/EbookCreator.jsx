// src/components/admin/EbookCreator.jsx
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPlus, FaTrash, FaSave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import Layout from '../../../../components/layout/Layout';

const EbookCreator = () => {
  const [ebook, setEbook] = useState({
    title: '',
    description: '',
    coverImageURL: '',
    chapters: [
      {
        chapterNo: 1,
        title: '',
        content: '',
        resourceLinks: [''],
      }
    ],
  });
  
  const [saving, setSaving] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([0]);
  const [error, setError] = useState('');

  const quillRefs = useRef([]);

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...ebook.chapters];
    updatedChapters[index][field] = value;
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const handleResourceLinkChange = (chapterIndex, linkIndex, value) => {
    const updatedChapters = [...ebook.chapters];
    updatedChapters[chapterIndex].resourceLinks[linkIndex] = value;
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const addChapter = () => {
    const newChapter = {
      chapterNo: ebook.chapters.length + 1,
      title: '',
      content: '',
      resourceLinks: [''],
    };
    setEbook({
      ...ebook,
      chapters: [...ebook.chapters, newChapter]
    });
    setExpandedChapters([...expandedChapters, ebook.chapters.length]);
  };

  const removeChapter = (index) => {
    if (ebook.chapters.length <= 1) return;
    
    const updatedChapters = [...ebook.chapters];
    updatedChapters.splice(index, 1);
    
    // Update chapter numbers
    const renumberedChapters = updatedChapters.map((chapter, idx) => ({
      ...chapter,
      chapterNo: idx + 1
    }));
    
    setEbook({
      ...ebook,
      chapters: renumberedChapters
    });
    
    // Update expanded chapters
    const updatedExpanded = [...expandedChapters];
    const removedIndex = updatedExpanded.indexOf(index);
    if (removedIndex !== -1) {
      updatedExpanded.splice(removedIndex, 1);
    }
    setExpandedChapters(updatedExpanded.map(i => i > index ? i - 1 : i));
  };

  const addResourceLink = (chapterIndex) => {
    const updatedChapters = [...ebook.chapters];
    updatedChapters[chapterIndex].resourceLinks.push('');
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const removeResourceLink = (chapterIndex, linkIndex) => {
    if (ebook.chapters[chapterIndex].resourceLinks.length <= 1) return;
    
    const updatedChapters = [...ebook.chapters];
    updatedChapters[chapterIndex].resourceLinks.splice(linkIndex, 1);
    setEbook({ ...ebook, chapters: updatedChapters });
  };

  const toggleChapterExpand = (index) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter(i => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
    }
  };

  const saveEbook = async () => {
    if (!ebook.title.trim()) {
      setError('Please enter a title for the eBook');
      return;
    }
    
    if (!ebook.coverImageURL.trim()) {
      setError('Please enter a cover image URL');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      // Create the main eBook document
      const ebookRef = await addDoc(collection(fireDB, 'Ebooks'), {
        title: ebook.title,
        description: ebook.description,
        coverImageURL: ebook.coverImageURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Save each chapter as a subcollection
      for (const chapter of ebook.chapters) {
        await addDoc(collection(fireDB, `Ebooks/${ebookRef.id}/chapters`), {
          chapterNo: chapter.chapterNo,
          title: chapter.title,
          content: chapter.content,
          resourceLinks: chapter.resourceLinks.filter(link => link.trim() !== '')
        });
      }
      
      alert('eBook saved successfully!');
      // Reset form
      setEbook({
        title: '',
        description: '',
        coverImageURL: '',
        chapters: [
          {
            chapterNo: 1,
            title: '',
            content: '',
            resourceLinks: [''],
          }
        ],
      });
      setExpandedChapters([0]);
    } catch (err) {
      console.error('Error saving eBook:', err);
      setError('Failed to save eBook. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 bg-purple-50 dark:bg-neutral-950 min-h-screen">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400 mb-6">Create New eBook</h1>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* eBook Metadata */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">eBook Details</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={ebook.title}
                  onChange={(e) => setEbook({...ebook, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Enter eBook title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={ebook.description}
                  onChange={(e) => setEbook({...ebook, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white h-32"
                  placeholder="Brief description of the eBook"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Cover Image URL *</label>
                <input
                  type="text"
                  value={ebook.coverImageURL}
                  onChange={(e) => setEbook({...ebook, coverImageURL: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Enter image URL"
                />
                {ebook.coverImageURL && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <img 
                      src={ebook.coverImageURL} 
                      alt="Cover preview" 
                      className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.parentNode.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Chapters Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chapters</h2>
              <button 
                onClick={addChapter}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Chapter
              </button>
            </div>
            
            <div className="space-y-4">
              {ebook.chapters.map((chapter, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-800"
                >
                  <div 
                    className="flex justify-between items-center p-4 bg-purple-100 dark:bg-neutral-800 cursor-pointer"
                    onClick={() => toggleChapterExpand(index)}
                  >
                    <div className="flex items-center">
                      <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {chapter.chapterNo}
                      </span>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {chapter.title || `Chapter ${chapter.chapterNo}`}
                      </h3>
                    </div>
                    <button className="text-gray-600 dark:text-gray-400">
                      {expandedChapters.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  
                  {expandedChapters.includes(index) && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Chapter Title</label>
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                          placeholder="Chapter title"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
                        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                          <ReactQuill
                            ref={(el) => (quillRefs.current[index] = el)}
                            value={chapter.content}
                            onChange={(content) => handleChapterChange(index, 'content', content)}
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-gray-700 dark:text-gray-300">Resource Links</label>
                          <button 
                            onClick={() => addResourceLink(index)}
                            className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-white py-1 px-2 rounded flex items-center"
                          >
                            <FaPlus className="mr-1" size={12} />
                            Add Link
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {chapter.resourceLinks.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex items-center">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => handleResourceLinkChange(index, linkIndex, e.target.value)}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                placeholder="https://example.com/resource"
                              />
                              <button 
                                onClick={() => removeResourceLink(index, linkIndex)}
                                className="bg-red-500 text-white p-2 rounded-r-lg"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          onClick={() => removeChapter(index)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
                        >
                          <FaTrash className="mr-2" />
                          Remove Chapter
                        </button>
                        
                        <button 
                          onClick={() => toggleChapterExpand(index)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center"
                        >
                          Collapse Chapter
                          <FaChevronUp className="ml-2" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-center">
            <button 
              onClick={saveEbook}
              disabled={saving}
              className={`bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-lg font-medium flex items-center ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save eBook
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EbookCreator;