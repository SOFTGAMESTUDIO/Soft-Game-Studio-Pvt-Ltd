import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  doc, getDoc, updateDoc,
  collection, getDocs, deleteDoc,
  serverTimestamp, addDoc
} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPlus, FaTrash, FaSave,
  FaChevronDown, FaChevronUp, FaArrowLeft
} from 'react-icons/fa';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import Layout from '../../../../components/layout/Layout';

// TipTap Editor Component
const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        HTMLAttributes: { class: 'text-purple-600 hover:underline' }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'bg-white dark:bg-neutral-800 p-3 border border-gray-300 dark:border-neutral-700 rounded-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100',
      },
    },
  });

  // Sync editor with external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = prompt('Enter URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="tiptap-editor">
      <div className="toolbar flex flex-wrap gap-1 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const EditEbook = () => {
  const { ebookId } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState({
    title: '',
    description: '',
    coverImageURL: '',
    chapters: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [error, setError] = useState('');

  // Fetch existing ebook data
  useEffect(() => {
    const fetchEbook = async () => {
      try {
        if (!ebookId) {
          navigate('/Admin-EBook');
          return;
        }
        const ebookRef = doc(fireDB, 'Ebooks', ebookId);
        const ebookDoc = await getDoc(ebookRef);
        if (!ebookDoc.exists()) {
          setError('eBook not found');
          setLoading(false);
          return;
        }
        const ebookData = ebookDoc.data();
        const chaptersSnapshot = await getDocs(
          collection(fireDB, `Ebooks/${ebookId}/chapters`)
        );
        const chapters = [];
        chaptersSnapshot.forEach(docSnap => {
          chapters.push({
            id: docSnap.id,
            ...docSnap.data()
          });
        });
        chapters.sort((a, b) => a.chapterNo - b.chapterNo);
        setEbook({
          id: ebookId,
          title: ebookData.title || '',
          description: ebookData.description || '',
          coverImageURL: ebookData.coverImageURL || '',
          chapters: chapters.length > 0 ? chapters : [{
            chapterNo: 1,
            title: 'Chapter 1',
            content: '',
            resourceLinks: [''],
          }]
        });
        setExpandedChapters(chapters.map((_, idx) => idx));
      } catch (err) {
        console.error('Error fetching eBook:', err);
        setError('Failed to load eBook data');
      } finally {
        setLoading(false);
      }
    };
    fetchEbook();
  }, [ebookId, navigate]);

  const handleEbookChange = (field, value) => {
    setEbook({ ...ebook, [field]: value });
  };

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
      title: `Chapter ${ebook.chapters.length + 1}`,
      content: '',
      resourceLinks: [''],
    };
    setEbook({
      ...ebook,
      chapters: [...ebook.chapters, newChapter]
    });
    setExpandedChapters([...expandedChapters, ebook.chapters.length]);
  };

  const deleteChapter = async (index) => {
    if (ebook.chapters.length <= 1) {
      setError('An eBook must have at least one chapter');
      return;
    }
    const chapterToDelete = ebook.chapters[index];
    const updatedChapters = [...ebook.chapters];
    updatedChapters.splice(index, 1);
    const renumberedChapters = updatedChapters.map((chapter, idx) => ({
      ...chapter,
      chapterNo: idx + 1
    }));
    if (chapterToDelete.id) {
      try {
        await deleteDoc(
          doc(fireDB, `Ebooks/${ebookId}/chapters`, chapterToDelete.id)
        );
      } catch (err) {
        console.error('Error deleting chapter:', err);
        setError('Failed to delete chapter');
        return;
      }
    }
    setEbook({ ...ebook, chapters: renumberedChapters });
    const updatedExpanded = expandedChapters
      .filter(i => i !== index)
      .map(i => i > index ? i - 1 : i);
    setExpandedChapters(updatedExpanded);
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

  // Pre-bind chapter content handlers
  const chapterContentHandlers = useMemo(() => {
    return ebook.chapters.map((_, idx) => (newContent) =>
      handleChapterChange(idx, "content", newContent)
    );
  }, [ebook.chapters]);

  const toggleChapterExpand = (index) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter(i => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
    }
  };

  const saveChanges = async () => {
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
      const ebookRef = doc(fireDB, 'Ebooks', ebookId);
      await updateDoc(ebookRef, {
        title: ebook.title,
        description: ebook.description,
        coverImageURL: ebook.coverImageURL,
        updatedAt: serverTimestamp()
      });
      for (const chapter of ebook.chapters) {
        const chapterData = {
          chapterNo: chapter.chapterNo,
          title: chapter.title,
          content: chapter.content,
          resourceLinks: chapter.resourceLinks.filter(link => link.trim() !== '')
        };
        if (chapter.id) {
          await updateDoc(
            doc(fireDB, `Ebooks/${ebookId}/chapters`, chapter.id),
            chapterData
          );
        } else {
          await addDoc(
            collection(fireDB, `Ebooks/${ebookId}/chapters`),
            chapterData
          );
        }
      }
      alert('eBook updated successfully!');
      navigate('/Admin-EBook');
    } catch (err) {
      console.error('Error saving eBook:', err);
      setError('Failed to save eBook. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 bg-gray-100 dark:bg-neutral-950 min-h-screen">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/Admin-EBook')}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to eBooks
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Edit eBook: {ebook.title || 'Untitled'}
            </h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          {/* eBook Metadata Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">eBook Details</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={ebook.title}
                  onChange={(e) => handleEbookChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Enter eBook title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={ebook.description}
                  onChange={(e) => handleEbookChange('description', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white h-32"
                  placeholder="Brief description of the eBook"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Cover Image URL *</label>
                <input
                  type="text"
                  value={ebook.coverImageURL}
                  onChange={(e) => handleEbookChange('coverImageURL', e.target.value)}
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
                  key={chapter.id || `new-${index}`} 
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-800"
                >
                  <div 
                    className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 cursor-pointer"
                    onClick={() => toggleChapterExpand(index)}
                  >
                    <div className="flex items-center">
                      <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {chapter.chapterNo}
                      </span>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {chapter.title || `Chapter ${chapter.chapterNo}`}
                      </h3>
                      {!chapter.id && (
                        <span className="ml-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChapter(index);
                        }}
                        className="mr-4 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                      <button className="text-gray-600 dark:text-gray-400">
                        {expandedChapters.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
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
                      
 


                          <div>
                          <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                          </label>
                          <TiptapEditor
  content={ebook.chapters[index].content}
  onChange={chapterContentHandlers[index]}
/>
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-center">
            <button 
              onClick={saveChanges}
              disabled={saving}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-medium flex items-center ${
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditEbook;